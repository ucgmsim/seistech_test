import json

from flask import jsonify, request
from jose import jwt

from .. import db
from ..server import app
from ..auth0 import get_token_auth_header, get_users
from ..decorator import requires_auth
from .. import constants as const
from . import project_api


@app.route(const.INTERMEDIATE_API_AUTH0_USER_INFO_ENDPOINT, methods=["GET"])
def get_user_key_info():
    """Getting users permission on their first launch
    At the same time, also update the allowed_permission table
    as we want to keep the allowed_permission table up to date
    for the dashboards.
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)

    user_id = unverified_claims["sub"].split("|")[1]
    permission_list = unverified_claims["permissions"]

    # Update the Allowed_Permission table
    db.update_allowed_permission(user_id, permission_list)

    return jsonify({"permissions": permission_list, "id": user_id})


# Edit User
@app.route(const.INTERMEDIATE_API_AUTH0_USERS_ENDPOINT, methods=["GET"])
@requires_auth
def get_auth0_users():
    """Retrieve all the existing users from the Auth0
    Will be used for User dropdown

    Have to use Auth0 as source for users, to allow
    setting user permission to users that don't
    exist in the DB yet
    """
    return jsonify(get_users())


@app.route(const.INTERMEDIATE_API_USER_ADDABLE_PROJECTS_ENDPOINT, methods=["GET"])
@requires_auth
def get_addable_projects():
    """Fetching all the allowed projects from the "Project API" to this certain user.
    Will be used for Addable Projects dropdown

    URL contains projectAPI due to usage of proxy_to_api function in get_projects_from_project_api
    as request object is made with the URL
    /intermediateAPI/projectAPI/addable_projects/get
    and this is how proxy_to_api knows that this object contains projectAPI in a full path
    to forward to Project API this request.
    """
    return jsonify(
        db.get_addable_projects(
            request.args.to_dict()["user_id"], project_api.get_all_projects()
        )
    )


@app.route(const.INTERMEDIATE_API_USER_ALLOWED_PROJECTS_ENDPOINT, methods=["GET"])
@requires_auth
def get_user_projects():
    """Fetching all the projects that are already allocated to this user
    Will be used for Allocated Projects dropdown
    """
    return jsonify(
        db.get_allowed_projects(
            request.args.to_dict()["user_id"], project_api.get_all_projects()
        )
    )


@app.route(const.INTERMEDIATE_API_USER_ALLOCATE_PROJECTS_ENDPOINT, methods=["POST"])
@requires_auth
def allocate_projects_to_user():
    """Allocate the chosen project(s) to the chosen user."""
    data = json.loads(request.data.decode())

    user_id = data["user_info"]["value"]
    project_list = data["project_info"]

    return jsonify(db.allocate_projects_to_user(user_id, project_list))


@app.route(const.INTERMEDIATE_API_USER_REMOVE_PROJECTS_ENDPOINT, methods=["POST"])
@requires_auth
def remove_projects_from_user():
    """Remove the chosen project(s) from the chosen user."""
    data = json.loads(request.data.decode())

    user_id = data["user_info"]["value"]
    project_list = data["project_info"]

    return jsonify(db.remove_projects_from_user(user_id, project_list))


@app.route(const.INTERMEDIATE_API_ALL_PROJECTS_ENDPOINT, methods=["GET"])
@requires_auth
def get_all_projects():
    """Get all possible projects to draw columns in the dashboard"""
    return db.filter_the_projects_for_dashboard(project_api.get_all_projects())


@app.route(const.INTERMEDIATE_API_ALL_ALLOWED_PROJECTS_ENDPOINT, methods=["GET"])
@requires_auth
def get_all_allowed_projects():
    """Get project permissions for all users"""
    return db.get_all_allowed_projects()


@app.route(const.INTERMEDIATE_API_ALL_PAGE_PERMISSIONS_ENDPOINT, methods=["GET"])
@requires_auth
def get_all_page_permission():
    """Pull every permission from Page_Access_Permission table"""
    return jsonify({"all_permission": db.get_all_permissions()})


@app.route(const.INTERMEDIATE_API_ALL_ALLOWED_PERMISSIONS_ENDPOINT, methods=["GET"])
@requires_auth
def get_all_allowed_permission():
    """Pull every granted permission from Granted_Permission table"""
    return db.get_all_allowed_permissions()
