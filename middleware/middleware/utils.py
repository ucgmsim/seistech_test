import requests
from typing import Dict

from jose import jwt
from flask import request, jsonify, Response

from server import (
    app,
    coreApiBase,
    projectApiBase,
    coreApiToken,
)


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


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
    route: str
        URL path to Core/Project API
    methods: str
        GET/POST methods
    endpoint: str
        To find out what user is performing
    content_type: str
        Entry-header field indicates the media type of the entity-body sent to the recipient.
        The default media type is application/json
    headers: object
        An object that stores some headers.
    """
    APIBase = coreApiBase

    if "projectAPI" in request.full_path:
        APIBase = projectApiBase

    # If endpoint is specified, its the one with uesrs' insteaction, record to DB
    # Filter the parameters with keys don't include `token`, for Download Data record
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


def requires_permission(required_permission):
    """Determines if the required scope is present in the Access Token
    Args:
        required_permission (str): The scope required to access the resource
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("permissions"):
        token_permissions = unverified_claims["permissions"]
        return required_permission in token_permissions
    return False


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header"""
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError(
            {
                "code": "authorization_header_missing",
                "description": "Authorization header is expected",
            },
            401,
        )

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must start with" " Bearer",
            },
            401,
        )
    elif len(parts) == 1:
        raise AuthError(
            {"code": "invalid_header", "description": "Token not found"}, 401
        )
    elif len(parts) > 2:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must be" " Bearer token",
            },
            401,
        )

    token = parts[1]
    return token
