from flask import jsonify, request
from ..server import (
    app,
    requires_auth,
    add_available_project_to_db,
    get_addable_projects,
)

import os
import json
import http.client
import requests

# To communicate with Management API
AUTH0_CLIENT_ID = os.environ["AUTH0_CLIENT_ID"]
AUTH0_CLIENT_SECRET = os.environ["AUTH0_CLIENT_SECRET"]
AUTH0_AUDIENCE = os.environ["AUTH0_AUDIENCE"]
AUTH0_GRANT_TYPE = os.environ["AUTH0_GRANT_TYPE"]
AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]


def get_management_api_token():
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
        headers={"Authorization": "Bearer {}".format(get_management_api_token())},
    )

    # List of dictionaries
    user_list = resp.json()

    user_dict = {}

    # We want to store in a dictionary in form of
    # { user_id : email | provider}
    # The reason we keep both email and provider is due to preventing confusion based on having the same emails but different provider
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


def allocate_users_to_projects():
    data = json.loads(request.data.decode())

    requested_user_id = data["user_info"]["value"]
    requested_project_list = data["project_info"]

    for project in requested_project_list:
        add_available_project_to_db(requested_user_id, project["value"])

    return "DONE"


"""MIDDLEWARE API
"""

# Will be uesd for User dropdown
@app.route("/middlewareAPI/auth0/user/get", methods=["GET"])
@requires_auth
def get_all_user_from_auth0():
    """Retrieve all the existing users from the Auth0"""
    return jsonify(get_users())


# Will be used for Project dropdown
# URL contains projectAPI due to usage of proxy_to_api function in get_projects_from_project_api
# as request object is made with the URL
# /middlewareAPI/projectAPI/addable_projects/get
# and this is how proxy_to_api knows that this object contains projectAPI in a full path
# to forward to Project API this request.
@app.route("/middlewareAPI/projectAPI/addable_projects/get", methods=["GET"])
@requires_auth
def get_all_projects_from_project_api():
    """Fetching all the available projects from the "Project API" to this certain user."""
    query_id = request.query_string.decode("utf-8").split("=")[1]
    return jsonify(get_addable_projects(query_id))


@app.route("/middlewareAPI/allocate_projects", methods=["POST"])
@requires_auth
def allocate_users_to_projects_api():
    """Allocate the given project(s) to the given user."""
    return jsonify(allocate_users_to_projects())
