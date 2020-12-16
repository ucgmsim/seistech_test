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

DATABASE = "mysql+pymysql://{0}:{1}@127.0.0.1:{2}/{3}".format(
    os.environ["USERNAME"],
    os.environ["PASSWORD"],
    os.environ["PORT"],
    os.environ["DBNAME"],
)

app = Flask("seistech_web")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

CORS(app)

from models import *

db.create_all()
db.session.commit()

ENV = os.environ["ENV"]
JWT_SECRET = os.environ["CORE_API_SECRET"]
AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]
API_AUDIENCE = os.environ["API_AUDIENCE"]
ALGORITHMS = os.environ["ALGORITHMS"]

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


def proxy_to_api(
    request,
    route,
    methods,
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
    content_type: str
        Entry-header field indicates the media type of the entity-body sent to the recipient.
        The default media type is application/json
    headers: object
        An object that stores some headers.
    """

    APIBase = coreApiBase

    if "projectAPI" in request.full_path:
        APIBase = projectApiBase

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
