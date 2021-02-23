from flask import jsonify, request
from jose import jwt

from .. import db
from ..server import app
from ..utils import proxy_to_api
from ..auth0 import get_token_auth_header, get_users
from ..decorator import requires_auth


@app.route("/user", methods=["GET"])
def get_user_permission():
    """Getting users permission on their first launch"""
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    return jsonify({"permissions": unverified_claims["permissions"]})


# Edit User
@app.route("/middlewareAPI/auth0/user/get", methods=["GET"])
@requires_auth
def get_all_user_from_auth0():
    """Retrieve all the existing users from the Auth0
    Will be used for User dropdown
    """
    return jsonify(get_users())


@app.route("/middlewareAPI/projectAPI/addable_projects/get", methods=["GET"])
@requires_auth
def get_addable_projects_with_project_api():
    """Fetching all the available projects from the "Project API" to this certain user.
    Will be used for Addable Projects dropdown

    URL contains projectAPI due to usage of proxy_to_api function in get_projects_from_project_api
    as request object is made with the URL
    /middlewareAPI/projectAPI/addable_projects/get
    and this is how proxy_to_api knows that this object contains projectAPI in a full path
    to forward to Project API this request.
    """
    requested_user_id = request.query_string.decode("utf-8").split("=")[1]
    all_projects_from_project_api = proxy_to_api(
        request, "api/project/ids/get", "GET"
    ).get_json()
    return jsonify(
        db.get_addable_projects(requested_user_id, all_projects_from_project_api)
    )


@app.route("/middlewareAPI/projectAPI/allocated_projects/get", methods=["GET"])
@requires_auth
def get_allocated_projects():
    """Fetching all the projects that are already allocated to this user
    Will be used for Allocated Projects dropdown
    """
    requested_user_id = request.query_string.decode("utf-8").split("=")[1]
    all_projects_from_project_api = proxy_to_api(
        request, "api/project/ids/get", "GET"
    ).get_json()
    return jsonify(
        db.get_available_projects(requested_user_id, all_projects_from_project_api)
    )


@app.route("/middlewareAPI/allocate_projects", methods=["POST"])
@requires_auth
def allocate_projects_to_user_call():
    """Allocate the chosen project(s) to the chosen user."""
    return jsonify(db.allocate_projects_to_user())


@app.route("/middlewareAPI/remove_projects", methods=["POST"])
@requires_auth
def remove_projects_from_user_call():
    """Remove the chosen project(s) from the chosen user."""
    return jsonify(db.remove_projects_from_user())
