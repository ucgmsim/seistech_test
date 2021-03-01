import requests
from typing import Dict

from flask import Response

from server import (
    CORE_API_BASE,
    PROJECT_API_BASE,
    CORE_API_TOKEN,
)
from db import write_request_details


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

    api_destination = CORE_API_BASE

    if to_project_api is True:
        api_destination = PROJECT_API_BASE

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
            headers={"Authorization": CORE_API_TOKEN},
        )

    elif methods == "GET":
        querystring = request.query_string.decode("utf-8")

        if querystring:
            querystring = "?" + querystring

        resp = requests.get(
            api_destination + route + querystring,
            headers={"Authorization": CORE_API_TOKEN},
        )

    response = Response(
        resp.content, resp.status_code, mimetype=content_type, headers=headers
    )

    return response
