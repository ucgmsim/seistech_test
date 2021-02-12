import os
import json
import requests
import http.client
from typing import Dict
from functools import wraps

from jose import jwt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from six.moves.urllib.request import urlopen
from flask import Flask, request, jsonify, _request_ctx_stack, Response


# DB Connection Setup
DATABASE = "mysql+pymysql://{0}:{1}@{2}/{3}".format(
    os.environ["DB_USERNAME"],
    os.environ["DB_PASSWORD"],
    os.environ["DB_SERVER"],
    os.environ["DB_NAME"],
)

app = Flask("seistech_web")

# Connect to DB
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


class CustomSQLALchemy(SQLAlchemy):
    """Customize the SQLAlchemy class to override isolation level"""

    def apply_driver_hacks(self, app, info, options):
        options.update(
            {"isolation_level": "READ COMMITTED",}
        )
        super(CustomSQLALchemy, self).apply_driver_hacks(app, info, options)


db = CustomSQLALchemy(app)

CORS(app)

# Import models before creating tables
# We need to import after initializing db object as it will be used in models.py
from models import *

# Create tables - It only creates when tables don't exist
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
AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]

# For DEV/EA/PROD with ENV
coreApiBase = os.environ["CORE_API_BASE"]
# For Project API with ENV
projectApiBase = os.environ["PROJECT_API_BASE"]

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


def _get_management_api_token():
    """Connect to AUTH0 Management API to get access token"""
    conn = http.client.HTTPSConnection(AUTH0_DOMAIN)

    payload = json.dumps(
        {
            "client_id": AUTH0_CLIENT_ID,
            "client_secret": AUTH0_CLIENT_SECRET,
            "audience": AUTH0_AUDIENCE,
            "grant_type": AUTH0_GRANT_TYPE,
        }
    )

    headers = {"content-type": "application/json"}

    conn.request("POST", "/oauth/token", payload, headers)

    res = conn.getresponse()
    # Convert the string dictionary to dictionray
    data = json.loads(res.read().decode("utf-8"))

    return data["access_token"]


def get_users():
    """Get all users"""
    resp = requests.get(
        AUTH0_AUDIENCE + "users",
        headers={"Authorization": "Bearer {}".format(_get_management_api_token())},
    )

    # List of dictionaries
    user_list, user_dict = resp.json(), {}

    # We want to store in a dictionary in form of
    # { user_id : email | provider}
    # The reason we keep both email and provider is due to preventing confusion
    # Based on having the same emails but different provider
    # For instance, email A with Google and email A with Auth0
    for user_dic in user_list:
        if "user_id" in user_dic.keys():
            temp_value = "{} | {}".format(
                user_dic["email"], user_dic["identities"][0]["provider"]
            )
            user_dict[user_dic["user_id"].split("|")[1]] = temp_value
        else:
            print(f"WARNING: No user_id found for user_dict {user_dict}")

    return user_dict


def _get_user_id():
    """We are storing Auth0 id to the DB so no need any extra steps.
    Just pull sub's value in a return dictionary which is the unique user_id from Auth0
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)

    user_id = unverified_claims["sub"].split("|")[1]

    return user_id


def _write_request_details(endpoint, query_dict):
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
    # Finding an user_id from the token
    user_id = _get_user_id()

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
        if attribute == "exceedances":
            # 'exceedances' value is comma-separated
            exceedances_list = value.split(",")
            for exceedance in exceedances_list:
                new_history = History_Request(latest_history_id, attribute, exceedance)
                db.session.add(new_history)
        else:
            new_history = History_Request(latest_history_id, attribute, value)
            db.session.add(new_history)

    db.session.commit()


def _get_projects_from_db(user_id):
    """Create an array form of available projects that are in the DB"""
    # Get all available projects that are allocated to this user.
    available_project_objs = (
        Project.query.join(available_projects_table)
        .filter((available_projects_table.c.user_id == user_id))
        .all()
    )

    # Create a list that contains Project IDs from DB (Allowed Projects)
    available_projects = [project.project_name for project in available_project_objs]

    return available_projects


def _get_projects_from_project_api():
    """Get a list of Project IDs & Project Names from Project API.
    (Available Projects that we currently have, not from the DB.)
    Form of
    {project_id: {name : project_name}}
    """
    return proxy_to_api(request, "api/project/ids/get", "GET").get_json()


def get_available_projects():
    """Do cross-check for the projects.

    It finds available projects from the DB.
    (Available_Project that contains user_id and project_name.)
    After we get all the existing projects from the Project API.
    Then we compare [Available Projects] and [All the Existing Projects]
    to find the matching one.
    """
    # Finding the available projects that are already allocated to the DB with a given user id.
    available_projects = _get_projects_from_db(_get_user_id())

    # Get a list of Project IDs & Project Names from Project API (Available Projects)
    # Form of {project_id: {name : project_name}}
    all_projects_dicts = _get_projects_from_project_api()

    # Create an dictionary in a form of if users have a permission for a certain project
    # {project_id: project_name}
    all_projects = {
        api_project_id: api_project_name["name"]
        for api_project_id, api_project_name in all_projects_dicts.items()
        if api_project_id in available_projects
    }

    return jsonify(all_projects)


def get_addable_projects(query_id):
    """Similar to the get_available_projects above.

    get_available_projects is there to do the cross-check for the Project tab,
    compare DB and Project API to see whether users actually have permission to access.

    This function, get_addable_projects is for Edit User feature in the frontend.
    It compares the projects between the DB and Project API.
    Then it returns the options that are not intersecting.
    E.g. DB says A,B,C Projects
    Project API says A,B,C,D,E

    Then this function will return D,E for the Frontend.
    """
    # Finding the available projects that are already allocated to the DB with a given user id.
    available_projects = _get_projects_from_db(query_id)

    # Get a list of Project IDs & Project Names from Project API (Available Projects)
    # Form of {project_id: {name : project_name}}
    all_projects_dicts = _get_projects_from_project_api()

    # Create an dictionary in a form of if users have a permission for a certain project
    # {project_id: project_name}
    all_addable_projects = {
        api_project_id: api_project_name["name"]
        for api_project_id, api_project_name in all_projects_dicts.items()
        if api_project_id not in available_projects
    }

    return all_addable_projects


def _is_user_in_db(user_id):
    """To check whether the given user_id is in the DB"""
    return bool(User.query.filter_by(user_id=user_id).first())


def _add_user_to_db(user_id):
    """Add an user to the MariaDB if not exist"""
    if not _is_user_in_db(user_id):
        db.session.add(User(user_id))
        db.session.commit()
        db.session.flush()
    else:
        print(f"User {user_id} already exists")


def _is_project_in_db(project_name):
    """To check whether the given project is in the DB"""
    return bool(Project.query.filter_by(project_name=project_name).first())


def _add_project_to_db(project_name):
    """Add a new project to the MariaDB if not exist"""
    if not _is_project_in_db(project_name):
        db.session.add(Project(project_name))
        db.session.commit()
        db.session.flush()
    else:
        print(f"Project {project_name} already exists")


def _add_available_project_to_db(user_id, project_name):
    """This is where we insert data to the bridging table, available_projects
    Unlike any other query, to a bridging table, we need to do the following steps:
    1. Find an User object by using user_id
    2. Find a Project object by using project_name
    3. Append(Allocate, they use Append for a bridging table) the User object to the Project object
    """
    print(f"Check whether the user is in the DB, if not, add the person to the DB")
    if not _is_user_in_db(user_id):
        print(f"{user_id} is not in the DB so updating it.")
        _add_user_to_db(user_id)
        db.session.flush()

    print(f"Check whether the project is in the DB, if not, add the project to the DB")
    if not _is_project_in_db(project_name):
        print(f"{project_name} is not in the DB so updating it.")
        _add_project_to_db(project_name)
        db.session.flush()

    # Find objects to user SQLAlchemy way of inserting to a bridging table.
    project_obj = Project.query.filter_by(project_name=project_name).first()
    user_obj = User.query.filter_by(user_id=user_id).first()

    project_obj.allocate.append(user_obj)
    db.session.commit()
    db.session.flush()


def allocate_users_to_projects():
    """Allocate projects to the chosen user"""
    data = json.loads(request.data.decode())

    requested_user_id = data["user_info"]["value"]
    requested_project_list = data["project_info"]

    for project in requested_project_list:
        _add_available_project_to_db(requested_user_id, project["value"])

    return "DONE"


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
        URL path to Core/Project API
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
    # Filter the parameters with keys don't include `token`, for Download Data record
    if endpoint is not None:
        _write_request_details(
            endpoint,
            {
                key: value
                for key, value in request.args.to_dict().items()
                if "token" not in key
            },
        )

    if methods == "POST":
        resp = requests.post(
            APIBase + route,
            data=request.data.decode(),
            headers={"Authorization": coreApiToken},
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
