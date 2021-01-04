import os
import json
from typing import Dict
from functools import wraps

import requests
from jose import jwt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from six.moves.urllib.request import urlopen
from flask import Flask, request, jsonify, _request_ctx_stack, Response


# DB Connection Setup
DATABASE = "mysql+pymysql://{0}:{1}@127.0.0.1:{2}/{3}".format(
    os.environ["USERNAME"],
    os.environ["PASSWORD"],
    os.environ["PORT"],
    os.environ["DBNAME"],
)

app = Flask("seistech_web")

# Connect to DB
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

CORS(app)

# Import models before creating tables
# We need to import after initializing db object as it will be used in models.py
from models import *

# Create tables
db.create_all()
db.session.commit()

ENV = os.environ["ENV"]
JWT_SECRET = os.environ["CORE_API_SECRET"]
AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]
API_AUDIENCE = os.environ["API_AUDIENCE"]
ALGORITHMS = os.environ["ALGORITHMS"]

# To communicate with Management API
AUTH0_CLIENT_ID = os.environ["AUTH0_CLIENT_ID"]
AUTH0_CLIENT_SECRET = os.environ["AUTH0_CLIENT_SECRET"]
AUTH0_AUDIENCE = os.environ["AUTH0_AUDIENCE"]
AUTH0_GRANT_TYPE = os.environ["AUTH0_GRANT_TYPE"]

# For DEV/EA/PROD with ENV
coreApiBase = os.environ["CORE_API_BASE"]
# For Project API with ENV
projectApiBase = os.environ["PROJECT_API_BASE"]
# In case I need to make a change locally - for SeisTech
# coreApiBase = "http://localhost:10022/"
# For SeisTech - Project tab
# coreApiBase = "http://localhost:10066/"

# Generate the coreAPI token
coreApiToken = "Bearer {}".format(
    jwt.encode({"env": ENV}, JWT_SECRET, algorithm="HS256")
)


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


def get_user_id():
    """We store Auth0 id to DB so no need extra step, just pull sub's value which is the unique user_id"""
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)

    user_id = unverified_claims["sub"]

    return user_id


def recored_history(endpoint, query_dict):
    """Record users' interation into the DB

    Parameters
    ----------
    endpoint: str
        What users chose to do
        E.g., Hazard Curver Compute, UHS Compute, Disaggregation Compute...
    query_dict: dictionary
        It is basically a query dictionary that contains attribute and value
        E.g., Attribute -> Station
              value -> CCCC
    """
    # Finding an user_id from the DB
    user_id = get_user_id()

    # Add to History table
    new_history = History(user_id, endpoint)

    db.session.add(new_history)
    db.session.commit()

    # Get a current user's history id key which would be the last row in a table
    latest_history_id = (
        History.query.filter_by(user_id=user_id)
        .order_by(History.history_id.desc())
        .first()
        .history_id
    )

    # For History_Request with attribute and value

    for attribute, value in query_dict.items():
        new_history = History_Request(latest_history_id, attribute, value)
        db.session.add(new_history)

    db.session.commit()


def get_available_projects():
    """Getting a list of projects name that are allocated to this user"""
    # Finding an user_id from the DB
    user_id = get_user_id()

    # Get all available projects that are allocated to this user.
    available_project_ids = (
        Project.query.join(available_projects_table)
        .join(User)
        .filter(
            (available_projects_table.c.user_id == User.user_id)
            & (available_projects_table.c.project_id == Project.project_id)
        )
        .all()
    )

    available_projects = []

    for project in available_project_ids:
        available_projects.append(project.project_name)

    return jsonify({"project_ids": available_projects})


def proxy_to_api(
    request,
    route,
    methods,
    endpoint: str = None,
    content_type: str = "application/json",
    headers: Dict = None,
):
    """Middleware - Handling the communication between Frontend and Core API.
    We check the request.full_path (e.g., projectAPI/ids/get)
    If it contains projectAPI, we siwtch APIBase to Project API path.
    Default is Core API path.

    Parameters
    ----------
    request: object
    route: str
        URL path to Core API
    methods: str
        GET/POST methods
    endpoint: str
        To find out what user is performing
    content_type: str
        Entry-header field indicates the media type of the entity-body sent to the recipient.
        The default media type is application/json
    headers: object
        An object that stores some headers.
    """

    APIBase = coreApiBase

    if "projectAPI" in request.full_path:
        APIBase = projectApiBase

    # If endpoint is specified, its the one with uesrs' insteaction, record to DB
    if endpoint is not None:
        recored_history(endpoint, request.args.to_dict())

    if methods == "POST":
        resp = requests.post(
            APIBase + route, data=request, headers={"Authorization": coreApiToken}
        )

    elif methods == "GET":
        querystring = request.query_string.decode("utf-8")

        if querystring:
            querystring = "?" + querystring

        resp = requests.get(
            APIBase + route + querystring, headers={"Authorization": coreApiToken}
        )

    response = Response(
        resp.content, resp.status_code, mimetype=content_type, headers=headers
    )

    return response


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header"""
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError(
            {
                "code": "authorization_header_missing",
                "description": "Authorization header is expected",
            },
            401,
        )

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must start with" " Bearer",
            },
            401,
        )
    elif len(parts) == 1:
        raise AuthError(
            {"code": "invalid_header", "description": "Token not found"}, 401
        )
    elif len(parts) > 2:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must be" " Bearer token",
            },
            401,
        )

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the Access Token is valid"""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://" + AUTH0_DOMAIN + "/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://" + AUTH0_DOMAIN + "/",
                )
            except jwt.ExpiredSignatureError:
                raise AuthError(
                    {"code": "token_expired", "description": "token is expired"}, 401
                )
            except jwt.JWTClaimsError:
                raise AuthError(
                    {
                        "code": "invalid_claims",
                        "description": "incorrect claims,"
                        "please check the audience and issuer",
                    },
                    401,
                )
            except Exception:
                raise AuthError(
                    {
                        "code": "invalid_header",
                        "description": "Unable to parse authentication" " token.",
                    },
                    401,
                )

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError(
            {"code": "invalid_header", "description": "Unable to find appropriate key"},
            401,
        )

    return decorated


def requires_permission(required_permission):
    """Determines if the required scope is present in the Access Token
    Args:
        required_permission (str): The scope required to access the resource
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("permissions"):
        token_permissions = unverified_claims["permissions"]
        return required_permission in token_permissions
    return False
