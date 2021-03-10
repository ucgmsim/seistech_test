import requests
from typing import Dict

from flask import Response

import middleware.db as db


def proxy_to_api(
    request,
    route,
    methods,
    api_destination: str,
    api_token: str,
    user_id: str = None,
    action: str = None,
    content_type: str = "application/json",
    headers: Dict = None,
):
    """IntermediateAPI - Handling the communication between Frontend and Core API/Project API.

    Parameters
    ----------
    request: object
    route: string
        URL path to Core/Project API
    methods: string
        GET/POST methods
    api_destination: string
        To determine the destination, either the CoreAPI or ProjectAPI
    api_token: string
        Special token to pass the CoreAPI/ProjectAPI's authorization check
    user_id: string
        Determining the user
    action: string
        To find out what user is performing
    content_type: string
        Entry-header field indicates the media type of the entity-body sent to the recipient.
        The default media type is application/json
    headers: object
        An object that stores some headers.
    """

    if action is not None and user_id is not None:
        db.write_request_details(
            user_id,
            action,
            {
                key: value
                for key, value in request.args.to_dict().items()
                if "token" not in key
            },
        )

    if methods == "POST":
        resp = requests.post(
            api_destination + route,
            data=request.data.decode(),
            headers={"Authorization": api_token},
        )

    elif methods == "GET":
        querystring = request.query_string.decode("utf-8")

        if querystring:
            querystring = "?" + querystring

        resp = requests.get(
            api_destination + route + querystring, headers={"Authorization": api_token},
        )

    response = Response(
        resp.content, resp.status_code, mimetype=content_type, headers=headers
    )

    return response


def get_user_projects(db_user_projects, api_projects):
    """Compute cross-check of allowed projects for the specified user
    with the available projects from the projectAPI

    It finds allowed projects from the DB.
    (Allowed_Project that contains user_id and project_name.)
    After we get all the existing projects from the Project API.
    Then we compare [Allowed Projects] and [All the Existing Projects]
    to find the matching one.

    Parameters
    ----------
    db_user_projects: list of dictionaries
        All allowed projects for the specified user

    api_projects: list of strings
        All projects from the project API (i.e. no constraints)

    Returns
    -------
    dictionary in the form of
    {
        project_code: project_name
    }
    """
    return {
        api_project_code: api_project_name["name"]
        for api_project_code, api_project_name in api_projects.items()
        if api_project_name["name"] in db_user_projects
    }
