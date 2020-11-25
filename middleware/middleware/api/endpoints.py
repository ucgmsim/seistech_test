import flask
from jose import jwt
from ..server import (
    app,
    proxy_to_core_api,
    requires_auth,
    requires_permission,
    AuthError,
    get_token_auth_header,
)

# Site Selection
@app.route("/ensembleids", methods=["GET"])
@requires_auth
def get_ensemble_ids():
    return proxy_to_core_api(flask.request, "api/gm_data/ensemble/ids/get", "GET")


@app.route("/imids", methods=["GET"])
@requires_auth
def get_im_ids():
    return proxy_to_core_api(flask.request, "api/gm_data/ensemble/ims/get", "GET")


@app.route("/location", methods=["GET"])
@requires_auth
def get_location():
    return proxy_to_core_api(flask.request, "api/site/station/location/get", "GET")


@app.route("/contextmap", methods=["GET"])
@requires_auth
def get_contextmap():
    return proxy_to_core_api(flask.request, "api/site/context/map/download", "GET")


@app.route("/vs30map", methods=["GET"])
@requires_auth
def get_vs30map():
    return proxy_to_core_api(flask.request, "api/site/vs30/map/download", "GET")


@app.route("/station", methods=["GET"])
@requires_auth
def get_station():
    return proxy_to_core_api(flask.request, "api/site/station/location/get", "GET")


# Seismic Hazard
@app.route("/hazard", methods=["GET"])
@requires_auth
def get_hazard():
    if requires_permission("hazard:hazard"):
        return proxy_to_core_api(flask.request, "api/hazard/ensemble_hazard/get", "GET")
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/disagg", methods=["GET"])
@requires_auth
def get_disagg():
    if requires_permission("hazard:disagg"):
        return proxy_to_core_api(flask.request, "api/disagg/ensemble_disagg/get", "GET")
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/uhs", methods=["GET"])
@requires_auth
def get_uhs():
    if requires_permission("hazard:uhs"):
        return proxy_to_core_api(flask.request, "api/uhs/ensemble_uhs/get", "GET")
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


# GMS
@app.route("/gms/ensemble_gms", methods=["POST"])
def compute_ensemble_GMS():
    return proxy_to_core_api(
        flask.request.data.decode(), "api/gms/ensemble_gms/compute", "POST"
    )


@app.route("/gms/default_im_weights", methods=["GET"])
def get_default_IM_weights():
    return proxy_to_core_api(
        flask.request, "api/gms/ensemble_gms/get_default_IM_weights", "GET"
    )


@app.route("/gms/default_causal_params", methods=["GET"])
def get_default_causal_params():
    return proxy_to_core_api(
        flask.request, "api/gms/ensemble_gms/get_default_causal_params", "GET"
    )


# Project
@app.route("/project/ids/get", methods=["GET"])
def get_project_ids():
    return proxy_to_core_api(flask.request, "api/project/ids/get", "GET")


@app.route("/project/sites/get", methods=["GET"])
def get_project_sites():
    return proxy_to_core_api(flask.request, "api/project/sites/get", "GET")


@app.route("/project/ims/get", methods=["GET"])
def get_project_ims():
    return proxy_to_core_api(flask.request, "api/project/ims/get", "GET")


@app.route("/project/hazard/get", methods=["GET"])
def get_project_hazard():
    return proxy_to_core_api(flask.request, "api/project/hazard/get", "GET")


@app.route("/project/disagg/get", methods=["GET"])
def get_project_disagg():
    return proxy_to_core_api(flask.request, "api/project/disagg/get", "GET")


@app.route("/project/disagg/rps/get", methods=["GET"])
def get_project_disagg_rps():
    return proxy_to_core_api(flask.request, "api/project/disagg/rps/get", "GET")


@app.route("/project/uhs/rps/get", methods=["GET"])
def get_project_uhs_rps():
    return proxy_to_core_api(flask.request, "api/project/uhs/rps/get", "GET")


@app.route("/project/uhs/get", methods=["GET"])
def get_project_uhs():
    return proxy_to_core_api(flask.request, "api/project/uhs/get", "GET")


@app.route("/project/maps/get", methods=["GET"])
def get_project_maps():
    return proxy_to_core_api(flask.request, "api/project/maps/get", "GET")


# Download
@app.route("/hazard_download/<token>", methods=["GET"])
def download_hazard(token):
    core_response = proxy_to_core_api(
        flask.request,
        f"api/hazard/ensemble_hazard/download/{token}",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return core_response


@app.route("/disagg_download/<token>", methods=["GET"])
def download_disagg(token):
    core_response = proxy_to_core_api(
        flask.request,
        f"api/disagg/ensemble_disagg/download/{token}",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return core_response


@app.route("/uhs_download/<token>", methods=["GET"])
def download_uhs(token):
    core_response = proxy_to_core_api(
        flask.request,
        f"api/uhs/ensemble_uhs/download/{token}",
        "GET",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return core_response


@app.route("/gms_download/<token>", methods=["GET"])
def download_gms(token):
    core_response = proxy_to_core_api(
        flask.request,
        f"api/gms/ensemble_gms/download/{token}",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return core_response


@app.route("/user", methods=["GET"])
def user_get():
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    return flask.jsonify({"permissions": unverified_claims["permissions"]})
