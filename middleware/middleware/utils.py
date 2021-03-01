import requests
from typing import Dict

from flask import Response

import middleware.db as db
import middleware.server as server


def proxy_to_api(
    request,
    route,
    methods,
    to_project_api: bool = False,
    endpoint: str = None,
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
    to_project_api: boolean
        Tell whether this call belongs to the ProjectAPI
    endpoint: string
        To find out what user is performing
    content_type: string
        Entry-header field indicates the media type of the entity-body sent to the recipient.
        The default media type is application/json
    headers: object
        An object that stores some headers.
    """

    api_destination = server.CORE_API_BASE

    if to_project_api is True:
        api_destination = server.PROJECT_API_BASE

    if endpoint is not None:
        write_request_details(
            endpoint,
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
            headers={"Authorization": server.CORE_API_TOKEN},
        )

    elif methods == "GET":
        querystring = request.query_string.decode("utf-8")

        if querystring:
            querystring = "?" + querystring

        resp = requests.get(
            api_destination + route + querystring,
            headers={"Authorization": server.CORE_API_TOKEN},
        )

    response = Response(
        resp.content, resp.status_code, mimetype=content_type, headers=headers
    )

    return response


def get_allowed_projects(user_id, user_db_projects, api_projects):
    """Compute cross-check of allowed projects for the specified user
    with the available projects from the projectAPI

    It finds allowed projects from the DB.
    (Available_Project that contains user_id and project_name.)
    After we get all the existing projects from the Project API.
    Then we compare [Available Projects] and [All the Existing Projects]
    to find the matching one.

    Parameters
    ----------
    user_id: str
        Auth0 user id
    user_db_projects: list of dictionaries

    api_projects: list of strings
        All projects from the project API (i.e. no constraints)

    Returns
    -------
    dictionary in the form of
    {
        project_id: project_name
    }
    """
    # Finding the allowed projects that are already allocated to the DB with a given user id.
    # allowed_projects = db.get_projects_from_db(user_id)

    # Create an dictionary in a form of if users have a permission for a certain project
    # {project_id: project_name}
    all_projects = {
        api_project_id: api_project_name["name"]
        for api_project_id, api_project_name in api_projects.items()
        if api_project_id in allowed_projects
    }

    return all_projects
