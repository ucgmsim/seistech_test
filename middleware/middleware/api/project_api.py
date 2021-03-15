import os

from jose import jwt
from flask import request

from middleware import app
import middleware.db as db
import middleware.utils as utils
import middleware.decorators as decorators
import middleware.auth0 as auth0
import middleware.constants as const
import middleware.api.intermediate_api as intermediate_api


# For Project API with ENV
PROJECT_API_BASE = os.environ["PROJECT_API_BASE"]

# Generate the coreAPI token
PROJECT_API_TOKEN = "Bearer {}".format(
    jwt.encode(
        {"env": os.environ["ENV"]}, os.environ["CORE_API_SECRET"], algorithm="HS256"
    )
)


# Site Selection
def _get_available_projects():
    return utils.proxy_to_api(
        request, "api/project/ids/get", "GET", PROJECT_API_BASE, PROJECT_API_TOKEN
    ).get_json()


@app.route(const.PROJECT_API_PROJECT_IDS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_available_project_ids():
    user_id = auth0.get_user_id()

    return utils.run_project_crosscheck(
        db.get_user_project_permission(user_id),
        intermediate_api.get_public_projects().get_json(),
        _get_available_projects(),
    )


@app.route(const.PROJECT_API_SITES_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_sites():
    return utils.proxy_to_api(
        request, "api/project/sites/get", "GET", PROJECT_API_BASE, PROJECT_API_TOKEN
    )


@app.route(const.PROJECT_API_IMS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_ims():
    return utils.proxy_to_api(
        request, "api/project/ims/get", "GET", PROJECT_API_BASE, PROJECT_API_TOKEN
    )


@app.route(const.PROJECT_API_MAPS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_maps():
    return utils.proxy_to_api(
        request,
        "api/project/maps/get",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - Site Selection Get",
    )


# Seismic Hazard
@app.route(const.PROJECT_API_HAZARD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_hazard():
    return utils.proxy_to_api(
        request,
        "api/project/hazard/get",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - Hazard Compute",
    )


@app.route(const.PROJECT_API_HAZARD_DISAGG_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_disagg():
    return utils.proxy_to_api(
        request,
        "api/project/disagg/get",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - Disaggregation Compute",
    )


@app.route(const.PROJECT_API_HAZARD_DISAGG_RPS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_disagg_rps():
    return utils.proxy_to_api(
        request,
        "api/project/disagg/rps/get",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
    )


@app.route(const.PROJECT_API_HAZARD_UHS_RPS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_uhs_rps():
    return utils.proxy_to_api(
        request, "api/project/uhs/rps/get", "GET", PROJECT_API_BASE, PROJECT_API_TOKEN
    )


@app.route(const.PROJECT_API_HAZARD_UHS_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def get_project_uhs():
    return utils.proxy_to_api(
        request,
        "api/project/uhs/get",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - UHS Compute",
    )


# PROJECT
@app.route(const.PROJECT_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def project_api_download_hazard():
    project_response = utils.proxy_to_api(
        request,
        "api/project/hazard/download",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - Hazard Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return project_response


@app.route(const.PROJECT_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def project_api_download_disagg():
    project_response = utils.proxy_to_api(
        request,
        "api/project/disagg/download",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - Disaggregation Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return project_response


@app.route(const.PROJECT_API_HAZARD_UHS_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def project_api_download_uhs():
    project_response = utils.proxy_to_api(
        request,
        "api/project/uhs/download",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - UHS Download",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return project_response


@app.route(const.PROJECT_API_GMS_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorators.requires_auth
def project_api_download_gms():
    project_response = utils.proxy_to_api(
        request,
        "api/gms/ensemble_gms/download",
        "GET",
        PROJECT_API_BASE,
        PROJECT_API_TOKEN,
        user_id=auth0.get_user_id(),
        action="Project - GMS Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return project_response
