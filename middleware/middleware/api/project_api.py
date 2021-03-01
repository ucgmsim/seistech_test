from flask import request

from ..server import app
from ..db import get_available_projects
from ..utils import proxy_to_api
from ..decorator import requires_auth
from ..auth0 import get_user_id
from .. import constants as const


# Site Selection
def get_all_projects_from_project_api():
    return proxy_to_api(request, "api/project/ids/get", "GET",).get_json()


@app.route(const.PROJECT_API_PROJECT_IDS_ENDPOINT, methods=["GET"])
@requires_auth
def get_available_project_ids():
    user_id = get_user_id()
    return get_available_projects(user_id, get_all_projects_from_project_api())


@app.route(const.PROJECT_API_SITES_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_sites():
    return proxy_to_api(request, "api/project/sites/get", "GET",)


@app.route(const.PROJECT_API_IMS_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_ims():
    return proxy_to_api(request, "api/project/ims/get", "GET",)


@app.route(const.PROJECT_API_MAPS_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_maps():
    return proxy_to_api(
        request, "api/project/maps/get", "GET", "Project - Site Selection Get"
    )


# Seismic Hazard
@app.route(const.PROJECT_API_HAZARD_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_hazard():
    return proxy_to_api(
        request, "api/project/hazard/get", "GET", "Project - Hazard Compute"
    )


@app.route(const.PROJECT_API_HAZARD_DISAGG_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_disagg():
    return proxy_to_api(
        request, "api/project/disagg/get", "GET", "Project - Disaggregation Compute",
    )


@app.route(const.PROJECT_API_HAZARD_DISAGG_RPS_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_disagg_rps():
    return proxy_to_api(request, "api/project/disagg/rps/get", "GET",)


@app.route(const.PROJECT_API_HAZARD_UHS_RPS_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_uhs_rps():
    return proxy_to_api(request, "api/project/uhs/rps/get", "GET",)


@app.route(const.PROJECT_API_HAZARD_UHS_ENDPOINT, methods=["GET"])
@requires_auth
def get_project_uhs():
    return proxy_to_api(request, "api/project/uhs/get", "GET", "Project - UHS Compute")


# PROJECT
@app.route(const.PROJECT_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT, methods=["GET"])
@requires_auth
def project_api_download_hazard():
    project_response = proxy_to_api(
        request,
        "api/project/hazard/download",
        "GET",
        "Project - Hazard Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return project_response


@app.route(const.PROJECT_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT, methods=["GET"])
@requires_auth
def project_api_download_disagg():
    project_response = proxy_to_api(
        request,
        "api/project/disagg/download",
        "GET",
        "Project - Disaggregation Download",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return project_response


@app.route(const.PROJECT_API_HAZARD_UHS_DOWNLOAD_ENDPOINT, methods=["GET"])
@requires_auth
def project_api_download_uhs():
    project_response = proxy_to_api(
        request,
        "api/project/uhs/download",
        "GET",
        "Project - UHS Download",
        content_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return project_response


@app.route(const.PROJECT_API_GMS_DOWNLOAD_ENDPOINT, methods=["GET"])
@requires_auth
def project_api_download_gms():
    project_response = proxy_to_api(
        request,
        "api/gms/ensemble_gms/download",
        "GET",
        content_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return project_response
