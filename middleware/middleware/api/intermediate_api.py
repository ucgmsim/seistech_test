import json

from flask import jsonify, request, Response
from jose import jwt

from middleware import app

import middleware.db as db
import middleware.utils as utils
import middleware.auth0 as auth0
import middleware.decorators as decorators
import middleware.constants as const


@app.route(const.INTERMEDIATE_API_AUTH0_USER_INFO_ENDPOINT, methods=["GET"])
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

    # Update the Users_Permissions table
    db.update_user_permissions(user_id, permission_list)

    return jsonify({"permissions": permission_list, "id": user_id})


# Edit User
@app.route(const.INTERMEDIATE_API_AUTH0_USERS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_auth0_users():
    """Fetching all the existing users from the Auth0
    Will be used for User dropdown

    Have to use Auth0 as source for users, to allow
    setting user permission to users that don't
    exist in the DB yet
    """
    return jsonify(auth0.get_users())


@app.route(const.INTERMEDIATE_API_ALL_PRIVATE_PROJECTS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_private_projects():
    """Fetching all private projects from the Project table"""
    return jsonify(db.get_certain_access_level_projects("private"))


@app.route(const.INTERMEDIATE_API_ALL_PUBLIC_PROJECTS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_public_projects():
    """Fetching all public projects from the Project table"""
    return jsonify(db.get_certain_access_level_projects("public"))


@app.route(const.INTERMEDIATE_API_USER_PROJECTS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_user_projects():
    """Fetching all the projects that are already allocated to a user
    Will be used for Allowed Projects dropdown
    """
    user_id = request.args.to_dict()["user_id"]

    return jsonify(db.get_user_projects(user_id))


@app.route(const.INTERMEDIATE_API_USER_ALLOCATE_PROJECTS_ENDPOINT, methods=["POST"])
@decorators.requires_auth
def allocate_projects_to_user():
    """Allocate the chosen project(s) to the chosen user."""
    data = json.loads(request.data.decode())

    user_id = data["user_info"]["value"]
    project_list = data["project_info"]

    db.allocate_projects_to_user(user_id, project_list)

    return Response(status=200)


@app.route(const.INTERMEDIATE_API_USER_REMOVE_PROJECTS_ENDPOINT, methods=["POST"])
@decorators.requires_auth
def remove_projects_from_user():
    """Remove the chosen project(s) from the chosen user."""
    data = json.loads(request.data.decode())

    user_id = data["user_info"]["value"]
    project_list = data["project_info"]

    db.remove_projects_from_user(user_id, project_list)

    return Response(status=200)


@app.route(const.INTERMEDIATE_API_ALL_USERS_PROJECTS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_all_users_projects():
    """Pull every allowed project for all users from Users_Projects table"""
    return db.get_all_users_projects()


@app.route(const.INTERMEDIATE_API_ALL_PERMISSIONS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_all_permissions():
    """Pull all possible access permission (Auth0_Permission table)"""
    return jsonify({"all_permissions": db.get_all_permissions_for_dashboard()})


@app.route(const.INTERMEDIATE_API_ALL_USERS_PERMISSIONS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_all_users_permissions():
    """Pull every allowed access permission for all uesrs from Users_Permissions table"""
    return db.get_all_users_permissions()
