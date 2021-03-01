from flask import request

import middleware.server as server
import middleware.db as db
import middleware.utils as utils
import middleware.decorator as decorator
import middleware.auth0 as auth0
import middleware.constants as const


# Site Selection
def get_all_projects():
    return utils.proxy_to_api(request, "api/project/ids/get", "GET", True).get_json()


@server.app.route(const.PROJECT_API_PROJECT_IDS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_available_project_ids():
    user_id = auth0.get_user_id()
    return db.get_allowed_projects(user_id, get_all_projects())


@server.app.route(const.PROJECT_API_SITES_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_sites():
    return utils.proxy_to_api(request, "api/project/sites/get", "GET", True)


@server.app.route(const.PROJECT_API_IMS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_ims():
    return utils.proxy_to_api(request, "api/project/ims/get", "GET", True)


@server.app.route(const.PROJECT_API_MAPS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_maps():
    return utils.proxy_to_api(
        request, "api/project/maps/get", "GET", True, "Project - Site Selection Get"
    )


# Seismic Hazard
@server.app.route(const.PROJECT_API_HAZARD_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_hazard():
    return utils.proxy_to_api(
        request, "api/project/hazard/get", "GET", True, "Project - Hazard Compute"
    )


@server.app.route(const.PROJECT_API_HAZARD_DISAGG_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_disagg():
    return utils.proxy_to_api(
        request,
        "api/project/disagg/get",
        "GET",
        True,
        "Project - Disaggregation Compute",
    )


@server.app.route(const.PROJECT_API_HAZARD_DISAGG_RPS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_disagg_rps():
    return utils.proxy_to_api(request, "api/project/disagg/rps/get", "GET", True)


@server.app.route(const.PROJECT_API_HAZARD_UHS_RPS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_uhs_rps():
    return utils.proxy_to_api(request, "api/project/uhs/rps/get", "GET", True)


@server.app.route(const.PROJECT_API_HAZARD_UHS_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def get_project_uhs():
    return utils.proxy_to_api(
        request, "api/project/uhs/get", "GET", True, "Project - UHS Compute"
    )


# PROJECT
@server.app.route(const.PROJECT_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def project_api_download_hazard():
    project_response = utils.proxy_to_api(
        request,
        "api/project/hazard/download",
        "GET",
        True,
        "Project - Hazard Download",
        content_type="server.application/zip",
        headers={"Content-Disposition": "attachment; filename=hazard.zip"},
    )

    return project_response


@server.app.route(const.PROJECT_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def project_api_download_disagg():
    project_response = utils.proxy_to_api(
        request,
        "api/project/disagg/download",
        "GET",
        True,
        "Project - Disaggregation Download",
        content_type="server.application/zip",
        headers={"Content-Disposition": "attachment; filename=disaggregation.zip"},
    )

    return project_response


@server.app.route(const.PROJECT_API_HAZARD_UHS_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def project_api_download_uhs():
    project_response = utils.proxy_to_api(
        request,
        "api/project/uhs/download",
        "GET",
        True,
        "Project - UHS Download",
        content_type="server.application/zip",
        headers={
            "Content-Disposition": "attachment; filename=uniform_hazard_spectrum.zip"
        },
    )

    return project_response


@server.app.route(const.PROJECT_API_GMS_DOWNLOAD_ENDPOINT, methods=["GET"])
@decorator.requires_auth
def project_api_download_gms():
    project_response = utils.proxy_to_api(
        request,
        "api/gms/ensemble_gms/download",
        "GET",
        True,
        content_type="server.application/zip",
        headers={"Content-Disposition": "attachment; filename=gms.zip"},
    )

    return project_response
