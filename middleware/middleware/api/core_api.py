from flask import request

from ..server import app
from ..utils import AuthError, requires_permission, proxy_to_api
from ..decorator import requires_auth

# Site Selection
@app.route("/coreAPI/ensembleids", methods=["GET"])
@requires_auth
def get_ensemble_ids():
    return proxy_to_api(request, "api/gm_data/ensemble/ids/get", "GET")


@app.route("/coreAPI/imids", methods=["GET"])
@requires_auth
def get_im_ids():
    return proxy_to_api(request, "api/gm_data/ensemble/ims/get", "GET")


@app.route("/coreAPI/contextmap", methods=["GET"])
@requires_auth
def get_contextmap():
    return proxy_to_api(request, "api/site/context/map/download", "GET")


@app.route("/coreAPI/vs30map", methods=["GET"])
@requires_auth
def get_vs30map():
    return proxy_to_api(request, "api/site/vs30/map/download", "GET")


@app.route("/coreAPI/station", methods=["GET"])
@requires_auth
def get_station():
    return proxy_to_api(
        request,
        "api/site/station/location/get",
        "GET",
        "Hazard Analysis - Set Station",
    )


# Seismic Hazard
@app.route("/coreAPI/hazard", methods=["GET"])
@requires_auth
def get_hazard():
    if requires_permission("hazard:hazard"):
        return proxy_to_api(
            request,
            "api/hazard/ensemble_hazard/get",
            "GET",
            "Hazard Analysis - Hazard Curve Compute",
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
            request,
            "api/hazard/nz1170p5/get",
            "GET",
            "Hazard Analysis - Hazard NZ Code Compute",
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
        return proxy_to_api(request, "api/hazard/nz1170p5/soil_class", "GET")
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
        return proxy_to_api(request, "api/hazard/nz1170p5/default_params", "GET")
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
            request,
            "api/disagg/ensemble_disagg/get",
            "GET",
            "Hazard Analysis - Disaggregation Compute",
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
            request, "api/uhs/ensemble_uhs/get", "GET", "Hazard Analysis - UHS Compute",
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
            request,
            "api/uhs/nz1170p5/get",
            "GET",
            "Hazard Analysis - UHS NZ Code Compute",
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
@requires_auth
def compute_ensemble_GMS():
    return proxy_to_api(request, "api/gms/ensemble_gms/compute", "POST", "GMS Compute",)


@app.route("/coreAPI/gms/default_im_weights", methods=["GET"])
@requires_auth
def get_default_IM_weights():
    return proxy_to_api(request, "api/gms/ensemble_gms/get_default_IM_weights", "GET")


@app.route("/coreAPI/gms/default_causal_params", methods=["GET"])
@requires_auth
def get_default_causal_params():
    return proxy_to_api(
        request, "api/gms/ensemble_gms/get_default_causal_params", "GET"
    )


# GMS
@app.route("/coreAPI/gms/ensemble_gms/datasets", methods=["GET"])
def get_gm_datasets():
    return proxy_to_api(request, "api/gms/ensemble_gms/datasets", "GET")


@app.route("/coreAPI/gms/ensemble_gms/ims", methods=["GET"])
def get_GMS_available_IMs():
    return proxy_to_api(request, "api/gms/ensemble_gms/ims", "GET")


# Download
# CORE API
@app.route("/coreAPI/hazard_download", methods=["GET"])
@requires_auth
def core_api_download_hazard():
    core_response = proxy_to_api(
        request,
        "api/hazard/ensemble_hazard/download",
        "GET",
        "Hazard Analysis - Hazard Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return core_response


@app.route("/coreAPI/disagg_download", methods=["GET"])
@requires_auth
def core_api_download_disagg():
    core_response = proxy_to_api(
        request,
        "api/disagg/ensemble_disagg/download",
        "GET",
        "Hazard Analysis - Disaggregation Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return core_response


@app.route("/coreAPI/uhs_download", methods=["GET"])
@requires_auth
def core_api_download_uhs():
    core_response = proxy_to_api(
        request,
        "api/uhs/ensemble_uhs/download",
        "GET",
        "Hazard Analysis - UHS Download",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return core_response


@app.route("/coreAPI/gms_download", methods=["GET"])
@requires_auth
def core_api_download_gms():
    core_response = proxy_to_api(
        request,
        "api/gms/ensemble_gms/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return core_response
