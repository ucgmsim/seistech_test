from flask import jsonify, request
from jose import jwt

from ..server import app
from ..db import (
    get_users,
    get_addable_projects,
    allocate_users_to_projects,
)
from ..utils import get_token_auth_header
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
def get_all_projects_from_project_api():
    """Fetching all the available projects from the "Project API" to this certain user.
    Will be used for Project dropdown

    URL contains projectAPI due to usage of proxy_to_api function in get_projects_from_project_api
    as request object is made with the URL
    /middlewareAPI/projectAPI/addable_projects/get
    and this is how proxy_to_api knows that this object contains projectAPI in a full path
    to forward to Project API this request.
    """
    query_id = request.query_string.decode("utf-8").split("=")[1]
    return jsonify(get_addable_projects(query_id))


@app.route("/middlewareAPI/allocate_projects", methods=["POST"])
@requires_auth
def allocate_users_to_projects_api():
    """Allocate the given project(s) to the given user."""
    return jsonify(allocate_users_to_projects())
