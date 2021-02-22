import requests
from typing import Dict

from flask import Response

from server import (
    coreApiBase,
    projectApiBase,
    coreApiToken,
)
from db import write_request_details


def proxy_to_api(
    request,
    route,
    methods,
    endpoint: str = None,
    content_type: str = "application/json",
    headers: Dict = None,
):
    """Middleware - Handling the communication between Frontend and Core API.
    We check the request.full_path (e.g., projectAPI/ids/get)
    If it contains projectAPI, we switch APIBase to Project API path.
    Default is Core API path.

    Parameters
    ----------
    request: object
    route: string
        URL path to Core/Project API
    methods: string
        GET/POST methods
    endpoint: string
        To find out what user is performing
    content_type: string
        Entry-header field indicates the media type of the entity-body sent to the recipient.
        The default media type is application/json
    headers: object
        An object that stores some headers.
    """

    APIBase = coreApiBase

    if "projectAPI" in request.full_path:
        APIBase = projectApiBase

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
            APIBase + route,
            data=request.data.decode(),
            headers={"Authorization": coreApiToken},
        )

    elif methods == "GET":
        querystring = request.query_string.decode("utf-8")

        if querystring:
            querystring = "?" + querystring

        resp = requests.get(
            APIBase + route + querystring, headers={"Authorization": coreApiToken}
        )

    response = Response(
        resp.content, resp.status_code, mimetype=content_type, headers=headers
    )

    return response
