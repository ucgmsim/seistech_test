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


def insert_all_users():
    """Insert all users into MariaDB. Need to run only once"""
    users = get_users()

    for user in users:
        temp_user = User(user)
        db.session.add(temp_user)

    db.session.commit()


def main():
    insert_all_users()


if __name__ == "__main__":
    main()