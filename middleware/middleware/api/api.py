from flask import jsonify, request
from ..server import (
    app,
    requires_auth,
    proxy_to_api,
)

import os
import json
import http.client
import requests
from models import *

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

    user_id_list = []

    # We want to store an actual id that comes after auth| or google| so split string by |
    for user_dic in user_list:
        if "user_id" in user_dic.keys():
            user_id_list.append(user_dic["user_id"].split("|")[1])
        else:
            print(f"WARNING: No user_id found for user_dict {user_dict}")

    return user_id_list


def add_user_to_db(user_id):
    """Add an user to the MariaDB if not exist"""
    try:
        new_user = User(user_id)
        db.session.add(new_user)
        db.session.commit()
    except:
        print(f"User {user_id} already exists")


def add_project_to_db(project_name):
    """Add a new project to the MariaDB if not exist

    The following if statement's condition will return True if row exists
    """
    if bool(Project.query.filter_by(project_name=project_name).first()) == False:
        new_project = Project(project_name)
        db.session.add(new_project)
        db.session.commit()
    else:
        print(f"Project {project_name} already exists")


"""MIDDLEWARE API
"""

# Will be uesd for User dropdown
@app.route("/api/auth0/user/get", methods=["GET"])
@requires_auth
def get_all_user_from_auth0():
    return jsonify({"all_users": get_users()})


# Will be used for Project dropdown
@app.route("/api/projectAPI/get", methods=["GET"])
@requires_auth
def get_all_projects_from_project_api():
    return proxy_to_api(request, "api/project/ids/get", "GET")


@app.route("/api/test", methods=["GET"])
def test():
    add_project_to_db("gnzl")
    return jsonify({"test": "DONE"})
