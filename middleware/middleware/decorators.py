import os
import json
from functools import wraps

from jose import jwt
from six.moves.urllib.request import urlopen
from flask import _request_ctx_stack

import middleware.auth0 as auth0

ALGORITHMS = os.environ["ALGORITHMS"]
API_AUDIENCE = os.environ["API_AUDIENCE"]


def requires_auth(f):
    """Determines if the Access Token is valid"""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = auth0.get_token_auth_header()
        json_url = urlopen("https://" + auth0.AUTH0_DOMAIN + "/.well-known/jwks.json")
        jwks = json.loads(json_url.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://" + auth0.AUTH0_DOMAIN + "/",
                )
            except jwt.ExpiredSignatureError:
                raise auth0.AuthError(
                    {"code": "token_expired", "description": "token is expired"}, 401
                )
            except jwt.JWTClaimsError:
                raise auth0.AuthError(
                    {
                        "code": "invalid_claims",
                        "description": "incorrect claims,"
                        "please check the audience and issuer",
                    },
                    401,
                )
            except Exception:
                raise auth0.AuthError(
                    {
                        "code": "invalid_header",
                        "description": "Unable to parse authentication" " token.",
                    },
                    401,
                )

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise auth0.AuthError(
            {"code": "invalid_header", "description": "Unable to find appropriate key"},
            401,
        )

    return decorated
