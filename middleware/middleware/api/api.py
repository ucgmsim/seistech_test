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

    # We want to store an actual id that comes after auth| or google| so split string by |

    for user_dic in user_list:
        if "user_id" in user_dic.keys():
            user_dict[user_dic["user_id"].split("|")[1]] = user_dic["email"]
        else:
            print(f"WARNING: No user_id found for user_dict {user_dict}")

    return user_dict


def allocate_users_to_projects():
    data = json.loads(request.data.decode())

    requested_user_id = data["user_info"]["value"]
    requested_project_list = data["project_info"]

    print(requested_project_list)

    for project in requested_project_list:
        add_available_project_to_db(requested_user_id, project["value"])

    return "DONE"


"""MIDDLEWARE API
"""

# Will be uesd for User dropdown
@app.route("/api/auth0/user/get", methods=["GET"])
@requires_auth
def get_all_user_from_auth0():
    return jsonify(get_users())


# Will be used for Project dropdown
@app.route("/api/projectAPI/get", methods=["GET"])
@requires_auth
def get_all_projects_from_project_api():
    query_id = request.query_string.decode("utf-8").split("=")[1]
    return jsonify(get_addable_projects(query_id))


@app.route("/api/allocate_projects", methods=["POST"])
@requires_auth
def allocate_users_to_projects_api():
    return jsonify(allocate_users_to_projects())
