import json

from flask import jsonify, request
from jose import jwt

import middleware.utils as utils
import middleware.decorator as decorator
import middleware.auth0 as auth0
import middleware.server as server
import middleware.db as db
import middleware.constants as const
import middleware.api.project_api as project_api


@server.app.route(const.INTERMEDIATE_API_AUTH0_USER_INFO_ENDPOINT, methods=["GET"])
def get_auth0_user_key_info():
    """Getting users permission on their first launch

    At the same time, also update the allowed_permission table
    as we want to keep the allowed_permission table up to date
    for the dashboards.
    """
    token = auth0.get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)

    user_id = unverified_claims["sub"].split("|")[1]
    permission_list = unverified_claims["permissions"]

    # Update the Allowed_Permission table
    db.update_allowed_permission(user_id, permission_list)

    return jsonify({"permissions": permission_list, "id": user_id})


# Edit User
@server.app.route(const.INTERMEDIATE_API_AUTH0_USERS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_auth0_users():
    """Fetching all the existing users from the Auth0
    Will be used for User dropdown

    Have to use Auth0 as source for users, to allow
    setting user permission to users that don't
    exist in the DB yet
    """
    return jsonify(auth0.get_users())


@server.app.route(
    const.INTERMEDIATE_API_USER_ADDABLE_PROJECTS_ENDPOINT, methods=["GET"]
)
@decorator.requires_auth
def get_addable_projects():
    """Fetching all the projects that can be allocated to a user
    Will be used for Addable Projects dropdown
    """
    return jsonify(
        db.get_addable_projects(
            request.args.to_dict()["user_id"], project_api.get_all_projects()
        )
    )


@server.app.route(
    const.INTERMEDIATE_API_USER_ALLOWED_PROJECTS_ENDPOINT, methods=["GET"]
)
@decorator.requires_auth
def get_user_allowed_projects():
    """Fetching all the projects that are already allocated to a user
    Will be used for Allowed Projects dropdown
    """
    return jsonify(
        utils.get_allowed_projects(
            request.args.to_dict()["user_id"],
            db.get_projects_from_db(user_id),
            project_api.get_all_projects(),
        )
    )


@server.app.route(
    const.INTERMEDIATE_API_USER_ALLOCATE_PROJECTS_ENDPOINT, methods=["POST"]
)
@decorator.requires_auth
def allocate_projects_to_user():
    """Allocate the chosen project(s) to the chosen user."""
    data = json.loads(request.data.decode())

    user_id = data["user_info"]["value"]
    project_list = data["project_info"]

    return jsonify(db.allocate_projects_to_user(user_id, project_list))


@server.app.route(
    const.INTERMEDIATE_API_USER_REMOVE_PROJECTS_ENDPOINT, methods=["POST"]
)
@decorator.requires_auth
def remove_projects_from_user():
    """Remove the chosen project(s) from the chosen user."""
    data = json.loads(request.data.decode())

    user_id = data["user_info"]["value"]
    project_list = data["project_info"]

    return jsonify(db.remove_projects_from_user(user_id, project_list))


@server.app.route(const.INTERMEDIATE_API_ALL_PROJECTS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_all_projects():
    """Get all projects to draw columns in the dashboard"""
    return db.filter_the_projects_for_dashboard(project_api.get_all_projects())


@server.app.route(const.INTERMEDIATE_API_ALL_ALLOWED_PROJECTS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_all_allowed_projects():
    """Get allowed project permissions for all users"""
    return db.get_all_allowed_projects()


@server.app.route(const.INTERMEDIATE_API_ALL_PAGE_PERMISSIONS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_all_page_permission():
    """Pull every permission from Page_Access_Permission table"""
    return jsonify({"all_permission": db.get_all_permissions()})


@server.app.route(
    const.INTERMEDIATE_API_ALL_ALLOWED_PERMISSIONS_ENDPOINT, methods=["GET"]
)
@decorator.requires_auth
def get_all_allowed_permission():
    """Pull every allowed permission from Allow_Permission table"""
    return db.get_all_allowed_permissions()
