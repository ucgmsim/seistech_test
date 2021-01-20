import flask
from jose import jwt
from ..server import (
    app,
    proxy_to_api,
    requires_auth,
    requires_permission,
    AuthError,
    get_token_auth_header,
    get_available_projects,
)

"""PROJECT API
"""

# Site Selection
# This endpoint will eventually replace get_project_ids when we implement DB properly
# As this function reads from Available_Project table (A bridge table between User and Project)
@app.route("/projectAPI/available_ids/get", methods=["GET"])
def get_available_project_ids():
    return get_available_projects()


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
    return proxy_to_api(
        flask.request, "api/project/maps/get", "GET", "Project - Site Selection Get"
    )


# Seismic Hazard
@app.route("/projectAPI/hazard/get", methods=["GET"])
def get_project_hazard():
    return proxy_to_api(
        flask.request, "api/project/hazard/get", "GET", "Project - Hazard Compute"
    )


@app.route("/projectAPI/disagg/get", methods=["GET"])
def get_project_disagg():
    return proxy_to_api(
        flask.request,
        "api/project/disagg/get",
        "GET",
        "Project - Disaggregation Compute",
    )


@app.route("/projectAPI/disagg/rps/get", methods=["GET"])
def get_project_disagg_rps():
    return proxy_to_api(flask.request, "api/project/disagg/rps/get", "GET")


@app.route("/projectAPI/uhs/rps/get", methods=["GET"])
def get_project_uhs_rps():
    return proxy_to_api(flask.request, "api/project/uhs/rps/get", "GET")


@app.route("/projectAPI/uhs/get", methods=["GET"])
def get_project_uhs():
    return proxy_to_api(
        flask.request, "api/project/uhs/get", "GET", "Project - UHS Compute"
    )


# PROJECT
@app.route("/projectAPI/hazard_download", methods=["GET"])
def project_api_download_hazard():
    project_response = proxy_to_api(
        flask.request,
        "api/project/hazard/download",
        "GET",
        "Project - Hazard Download",
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
        "Project - Disaggregation Download",
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
        "Project - UHS Download",
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