import flask
from jose import jwt
from ..server import (
    app,
    proxy_to_api,
    requires_auth,
    requires_permission,
    AuthError,
    get_token_auth_header,
)

"""CORE API
"""

# Site Selection
@app.route("/coreAPI/ensembleids", methods=["GET"])
@requires_auth
def get_ensemble_ids():
    return proxy_to_api(flask.request, "api/gm_data/ensemble/ids/get", "GET")


@app.route("/coreAPI/imids", methods=["GET"])
@requires_auth
def get_im_ids():
    return proxy_to_api(flask.request, "api/gm_data/ensemble/ims/get", "GET")


@app.route("/coreAPI/contextmap", methods=["GET"])
@requires_auth
def get_contextmap():
    return proxy_to_api(flask.request, "api/site/context/map/download", "GET")


@app.route("/coreAPI/vs30map", methods=["GET"])
@requires_auth
def get_vs30map():
    return proxy_to_api(flask.request, "api/site/vs30/map/download", "GET")


@app.route("/coreAPI/station", methods=["GET"])
@requires_auth
def get_station():
    return proxy_to_api(
        flask.request, "api/site/station/location/get", "GET", "Set Station"
    )


# Seismic Hazard
@app.route("/coreAPI/hazard", methods=["GET"])
@requires_auth
def get_hazard():
    if requires_permission("hazard:hazard"):
        return proxy_to_api(
            flask.request,
            "api/hazard/ensemble_hazard/get",
            "GET",
            "Hazard Curve Compute",
        )
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/coreAPI/hazard/nz1170p5", methods=["GET"])
@requires_auth
def get_hazard_nzcode():
    if requires_permission("hazard:hazard"):
        return proxy_to_api(
            flask.request, "api/hazard/nz1170p5/get", "GET", "Hazard NZ Code Compute"
        )
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/coreAPI/hazard/nz1170p5/soil_class", methods=["GET"])
@requires_auth
def get_nzcode_soil_class():
    if requires_permission("hazard:hazard"):
        return proxy_to_api(flask.request, "api/hazard/nz1170p5/soil_class", "GET")
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/coreAPI/hazard/nz1170p5/default", methods=["GET"])
@requires_auth
def get_nzcode_default_params():
    if requires_permission("hazard:hazard"):
        return proxy_to_api(flask.request, "api/hazard/nz1170p5/default_params", "GET")
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/coreAPI/disagg", methods=["GET"])
@requires_auth
def get_disagg():
    if requires_permission("hazard:disagg"):
        return proxy_to_api(
            flask.request,
            "api/disagg/ensemble_disagg/get",
            "GET",
            "Disaggregation Compute",
        )
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/coreAPI/uhs", methods=["GET"])
@requires_auth
def get_uhs():
    if requires_permission("hazard:uhs"):
        return proxy_to_api(
            flask.request, "api/uhs/ensemble_uhs/get", "GET", "UHS Compute"
        )
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route("/coreAPI/uhs/nz1170p5", methods=["GET"])
@requires_auth
def get_uhs_nzcode():
    if requires_permission("hazard:hazard"):
        return proxy_to_api(
            flask.request, "api/uhs/nz1170p5/get", "GET", "UHS NZ Code Compute"
        )
    raise AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


# GMS
@app.route("/coreAPI/gms/ensemble_gms", methods=["POST"])
def compute_ensemble_GMS():
    return proxy_to_api(
        flask.request.data.decode(),
        "api/gms/ensemble_gms/compute",
        "POST",
        "GMS Compute",
    )


@app.route("/coreAPI/gms/default_im_weights", methods=["GET"])
def get_default_IM_weights():
    return proxy_to_api(
        flask.request, "api/gms/ensemble_gms/get_default_IM_weights", "GET"
    )


@app.route("/coreAPI/gms/default_causal_params", methods=["GET"])
def get_default_causal_params():
    return proxy_to_api(
        flask.request, "api/gms/ensemble_gms/get_default_causal_params", "GET"
    )


"""PROJECT API
"""

# Site Selection
@app.route("/projectAPI/ids/get", methods=["GET"])
def get_project_ids():
    return proxy_to_api(flask.request, "api/project/ids/get", "GET")


@app.route("/projectAPI/sites/get", methods=["GET"])
def get_project_sites():
    return proxy_to_api(flask.request, "api/project/sites/get", "GET")


@app.route("/projectAPI/ims/get", methods=["GET"])
def get_project_ims():
    return proxy_to_api(flask.request, "api/project/ims/get", "GET")


@app.route("/projectAPI/maps/get", methods=["GET"])
def get_project_maps():
    return proxy_to_api(flask.request, "api/project/maps/get", "GET")


# Seismic Hazard
@app.route("/projectAPI/hazard/get", methods=["GET"])
def get_project_hazard():
    return proxy_to_api(flask.request, "api/project/hazard/get", "GET", "Project Hazard Compute")


@app.route("/projectAPI/disagg/get", methods=["GET"])
def get_project_disagg():
    return proxy_to_api(flask.request, "api/project/disagg/get", "GET", "Project Disaggregation Compute")


@app.route("/projectAPI/disagg/rps/get", methods=["GET"])
def get_project_disagg_rps():
    return proxy_to_api(flask.request, "api/project/disagg/rps/get", "GET")


@app.route("/projectAPI/uhs/rps/get", methods=["GET"])
def get_project_uhs_rps():
    return proxy_to_api(flask.request, "api/project/uhs/rps/get", "GET")


@app.route("/projectAPI/uhs/get", methods=["GET"])
def get_project_uhs():
    return proxy_to_api(flask.request, "api/project/uhs/get", "GET", "Project UHS Compute")


"""Because we do not have Download available for Project yet.
We send requests to Core API for now.
"""

# Download
# CORE API
@app.route("/coreAPI/hazard_download", methods=["GET"])
def core_api_download_hazard():
    core_response = proxy_to_api(
        flask.request,
        "api/hazard/ensemble_hazard/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return core_response


@app.route("/coreAPI/disagg_download", methods=["GET"])
def core_api_download_disagg():
    core_response = proxy_to_api(
        flask.request,
        "api/disagg/ensemble_disagg/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return core_response


@app.route("/coreAPI/uhs_download", methods=["GET"])
def core_api_download_uhs():
    core_response = proxy_to_api(
        flask.request,
        "api/uhs/ensemble_uhs/download",
        "GET",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return core_response


@app.route("/coreAPI/gms_download", methods=["GET"])
def core_api_download_gms():
    core_response = proxy_to_api(
        flask.request,
        "api/gms/ensemble_gms/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return core_response


# PROJECT
@app.route("/projectAPI/hazard_download", methods=["GET"])
def project_api_download_hazard():
    project_response = proxy_to_api(
        flask.request,
        "api/project/hazard/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return project_response


@app.route("/projectAPI/disagg_download", methods=["GET"])
def project_api_download_disagg():
    project_response = proxy_to_api(
        flask.request,
        "api/project/disagg/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return project_response


@app.route("/projectAPI/uhs_download", methods=["GET"])
def project_api_download_uhs():
    project_response = proxy_to_api(
        flask.request,
        "api/project/uhs/download",
        "GET",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return project_response


@app.route("/projectAPI/gms_download", methods=["GET"])
def project_api_download_gms():
    project_response = proxy_to_api(
        flask.request,
        "api/gms/ensemble_gms/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return project_response


@app.route("/user", methods=["GET"])
def user_get():
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    print(unverified_claims)
    return flask.jsonify({"permissions": unverified_claims["permissions"]})
