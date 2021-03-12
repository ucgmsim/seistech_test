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

    if action and user_id:
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


def get_user_projects(db_user_projects, public_projects, project_api_projects):
    """Compute cross-check of assigned projects for the specified user
    with the verified projects(one with values that can be used) from the projectAPI

    It finds assigned private projects from the Users_Permission table.
    Then check these assigned projects + all public projects(From Project table), 
    with verified projects from Project API to check 
    whether they are valid projects to perform/use

    For instance, nzgl is in the DB but some issues found and disabled from ProjectAPI,
    then the user will not see nzgl until we fix any issues.

    Parameters
    ----------
    db_user_projects: Dictionary
        All assigned private projects for the specified user

    public_projects: Dictionary
        All Public projects from the Project table

    project_api_projects: Dictionary
        All projects from the project API

    Returns
    -------
    dictionary in the form of
    {
        project_id: project_name
    }
    """

    return {
        api_project_code: api_project_name["name"]
        for api_project_code, api_project_name in project_api_projects.items()
        if (api_project_code in db_user_projects or api_project_code in public_projects)
    }
