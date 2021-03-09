import os

from jose import jwt
from flask import request

from middleware import app

import middleware.utils as utils
import middleware.auth0 as auth0
import middleware.decorators as decorators
import middleware.constants as const


# For DEV/EA/PROD with ENV
CORE_API_BASE = os.environ["CORE_API_BASE"]

# Generate the coreAPI token
CORE_API_TOKEN = "Bearer {}".format(
    jwt.encode(
        {"env": os.environ["ENV"]}, os.environ["CORE_API_SECRET"], algorithm="HS256"
    )
)

# Site Selection
@app.route(const.CORE_API_ENSEMBLE_IDS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_ensemble_ids():
    return utils.proxy_to_api(
        request, "api/gm_data/ensemble/ids/get", "GET", CORE_API_BASE
    )


@app.route(const.CORE_API_IMS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_im_ids():
    return utils.proxy_to_api(
        request, "api/gm_data/ensemble/ims/get", "GET", CORE_API_BASE
    )


@app.route(const.CORE_API_CONTEXT_MAP_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_contextmap():
    return utils.proxy_to_api(
        request, "api/site/context/map/download", "GET", CORE_API_BASE
    )


@app.route(const.CORE_API_VS30_MAP_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_vs30map():
    return utils.proxy_to_api(
        request, "api/site/vs30/map/download", "GET", CORE_API_BASE
    )


@app.route(const.CORE_API_STATION_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_station():
    return utils.proxy_to_api(
        request,
        "api/site/station/location/get",
        "GET",
        CORE_API_BASE,
        endpoint="Hazard Analysis - Set Station",
    )


# Seismic Hazard
@app.route(const.CORE_API_HAZARD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_hazard():
    if auth0.requires_permission("hazard:hazard"):
        return utils.proxy_to_api(
            request,
            "api/hazard/ensemble_hazard/get",
            "GET",
            CORE_API_BASE,
            endpoint="Hazard Analysis - Hazard Curve Compute",
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route(const.CORE_API_HAZARD_NZ11705_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_hazard_nzcode():
    if auth0.requires_permission("hazard:hazard"):
        return utils.proxy_to_api(
            request,
            "api/hazard/nz1170p5/get",
            "GET",
            CORE_API_BASE,
            endpoint="Hazard Analysis - Hazard NZ Code Compute",
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route(const.CORE_API_HAZARD_NZ11705_SOIL_CLASS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_nzcode_soil_class():
    if auth0.requires_permission("hazard:hazard"):
        return utils.proxy_to_api(
            request, "api/hazard/nz1170p5/soil_class", "GET", CORE_API_BASE
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route(const.CORE_API_HAZARD_NZ11705_DEFAULT_PARAMS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_nzcode_default_params():
    if auth0.requires_permission("hazard:hazard"):
        return utils.proxy_to_api(
            request, "api/hazard/nz1170p5/default_params", "GET", CORE_API_BASE
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route(const.CORE_API_HAZARD_DISAGG_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_disagg():
    if auth0.requires_permission("hazard:disagg"):
        return utils.proxy_to_api(
            request,
            "api/disagg/ensemble_disagg/get",
            "GET",
            CORE_API_BASE,
            endpoint="Hazard Analysis - Disaggregation Compute",
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route(const.CORE_API_HAZARD_UHS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_uhs():
    if auth0.requires_permission("hazard:uhs"):
        return utils.proxy_to_api(
            request,
            "api/uhs/ensemble_uhs/get",
            "GET",
            CORE_API_BASE,
            endpoint="Hazard Analysis - UHS Compute",
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


@app.route(const.CORE_API_HAZARD_UHS_NZ11705_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_uhs_nzcode():
    if auth0.requires_permission("hazard:hazard"):
        return utils.proxy_to_api(
            request,
            "api/uhs/nz1170p5/get",
            "GET",
            CORE_API_BASE,
            endpoint="Hazard Analysis - UHS NZ Code Compute",
        )
    raise auth0.AuthError(
        {
            "code": "Unauthorized",
            "description": "You don't have access to this resource",
        },
        403,
    )


# GMS
@app.route(const.CORE_API_GMS_ENDPOINT, methods=["POST"])
@decorators.requires_auth
def compute_ensemble_GMS():
    return utils.proxy_to_api(
        request,
        "api/gms/ensemble_gms/compute",
        "POST",
        CORE_API_BASE,
        endpoint="Hazard Analysis - GMS Compute",
    )


@app.route(const.CORE_API_GMS_DEFAULT_IM_WEIGHTS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_default_IM_weights():
    return utils.proxy_to_api(
        request, "api/gms/ensemble_gms/get_default_IM_weights", "GET"
    )


@app.route(const.CORE_API_GMS_DEFAULT_CAUSAL_PARAMS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_default_causal_params():
    return utils.proxy_to_api(
        request, "api/gms/ensemble_gms/get_default_causal_params", "GET", CORE_API_BASE
    )


# GMS
@app.route(const.CORE_API_GMS_DATASETS_ENDPOINT, methods=["GET"])
def get_gm_datasets():
    return utils.proxy_to_api(
        request, "api/gms/ensemble_gms/datasets", "GET", CORE_API_BASE
    )


@app.route(const.CORE_API_GMS_IMS_ENDPOINT_ENDPOINT, methods=["GET"])
def get_GMS_available_IMs():
    return utils.proxy_to_api(request, "api/gms/ensemble_gms/ims", "GET", CORE_API_BASE)


# Download
# CORE API
@app.route(const.CORE_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def core_api_download_hazard():
    core_response = utils.proxy_to_api(
        request,
        "api/hazard/ensemble_hazard/download",
        "GET",
        CORE_API_BASE,
        endpoint="Hazard Analysis - Hazard Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return core_response


@app.route(const.CORE_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def core_api_download_disagg():
    core_response = utils.proxy_to_api(
        request,
        "api/disagg/ensemble_disagg/download",
        "GET",
        CORE_API_BASE,
        endpoint="Hazard Analysis - Disaggregation Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return core_response


@app.route(const.CORE_API_HAZARD_UHS_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def core_api_download_uhs():
    core_response = utils.proxy_to_api(
        request,
        "api/uhs/ensemble_uhs/download",
        "GET",
        CORE_API_BASE,
        endpoint="Hazard Analysis - UHS Download",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return core_response


@app.route(const.CORE_API_GMS_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def core_api_download_gms():
    core_response = utils.proxy_to_api(
        request,
        "api/gms/ensemble_gms/download",
        "GET",
        CORE_API_BASE,
        endpoint="Hazard Analysis - GMS Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return core_response
