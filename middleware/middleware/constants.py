# Core API Endpoints - Hazard Analysis tab
# Site Selection
CORE_API_ENSEMBLE_IDS_ENDPOINT = "/coreAPI/ensembleids/get"
CORE_API_IMS_ENDPOINT = "/coreAPI/ims/get"
CORE_API_CONTEXT_MAP_ENDPOINT = "/coreAPI/contextmap/get"
CORE_API_VS30_MAP_ENDPOINT = "/coreAPI/vs30map/get"
CORE_API_STATION_ENDPOINT = "/coreAPI/station/get"

# Seismic Hazard
CORE_API_HAZARD_ENDPOINT = "/coreAPI/hazard/get"
CORE_API_HAZARD_NZS1170P5_ENDPOINT = "/coreAPI/hazard/nz1170p5/get"
CORE_API_HAZARD_NZS1170P5_SOIL_CLASS_ENDPOINT = (
    "/coreAPI/hazard/nz1170p5/soil_class/get"
)
CORE_API_HAZARD_NZS1170P5_DEFAULT_PARAMS_ENDPOINT = (
    "/coreAPI/hazard/nz1170p5/default/get"
)
CORE_API_HAZARD_DISAGG_ENDPOINT = "/coreAPI/disagg/get"
CORE_API_HAZARD_UHS_ENDPOINT = "/coreAPI/uhs/get"
CORE_API_HAZARD_UHS_NZS1170P5_ENDPOINT = "/coreAPI/uhs/nz1170p5/get"

# Ground Motion Selection
CORE_API_GMS_ENDPOINT = "/coreAPI/gms/ensemble_gms/get"
CORE_API_GMS_DEFAULT_IM_WEIGHTS_ENDPOINT = "/coreAPI/gms/default_im_weights/get"
CORE_API_GMS_DEFAULT_CAUSAL_PARAMS_ENDPOINT = "/coreAPI/gms/default_causal_params/get"
CORE_API_GMS_DATASETS_ENDPOINT = "/coreAPI/gms/ensemble_gms/datasets/get"
CORE_API_GMS_IMS_ENDPOINT_ENDPOINT = "/coreAPI/gms/ensemble_gms/ims/get"

# Download Endpoints
CORE_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT = "/coreAPI/hazard/download"
CORE_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT = "/coreAPI/disagg/download"
CORE_API_HAZARD_UHS_DOWNLOAD_ENDPOINT = "/coreAPI/uhs/download"
CORE_API_GMS_DOWNLOAD_ENDPOINT = "/coreAPI/gms/download"

# Project API Endpoints - Project tab
# Site Selection
PROJECT_API_PROJECT_IDS_ENDPOINT = "/projectAPI/ids/get"
PROJECT_API_SITES_ENDPOINT = "/projectAPI/sites/get"
PROJECT_API_IMS_ENDPOINT = "/projectAPI/ims/get"
PROJECT_API_MAPS_ENDPOINT = "/projectAPI/maps/get"

# Seismic Hazard
PROJECT_API_HAZARD_ENDPOINT = "/projectAPI/hazard/get"
PROJECT_API_HAZARD_DISAGG_ENDPOINT = "/projectAPI/disagg/get"
PROJECT_API_HAZARD_DISAGG_RPS_ENDPOINT = "/projectAPI/disagg/rps/get"
PROJECT_API_HAZARD_UHS_ENDPOINT = "/projectAPI/uhs/get"
PROJECT_API_HAZARD_UHS_RPS_ENDPOINT = "/projectAPI/uhs/rps/get"

# Download Endpoints
PROJECT_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT = "/projectAPI/hazard/download"
PROJECT_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT = "/projectAPI/disagg/download"
PROJECT_API_HAZARD_UHS_DOWNLOAD_ENDPOINT = "/projectAPI/uhs/download"
PROJECT_API_GMS_DOWNLOAD_ENDPOINT = "/projectAPI/gms/download"

# Intermediate API Endpoints
INTERMEDIATE_API_AUTH0_USER_INFO_ENDPOINT = (
    "/intermediateAPI/auth0/user/permissions/get"
)
INTERMEDIATE_API_AUTH0_USERS_ENDPOINT = "/intermediateAPI/auth0/users/get"

INTERMEDIATE_API_ALL_USERS_PROJECTS_ENDPOINT = "/intermediateAPI/users_projects/get/all"

INTERMEDIATE_API_USER_PROJECTS_ENDPOINT = "/intermediateAPI/user/projects/get"
INTERMEDIATE_API_USER_ALLOCATE_PROJECTS_ENDPOINT = (
    "/intermediateAPI/user/allocate_projects"
)
INTERMEDIATE_API_USER_REMOVE_PROJECTS_ENDPOINT = "/intermediateAPI/user/remove_projects"

INTERMEDIATE_API_ALL_PERMISSIONS_ENDPOINT = "/intermediateAPI/permission/get/all"

INTERMEDIATE_API_ALL_USERS_PERMISSIONS_ENDPOINT = (
    "/intermediateAPI/users_permissions/get/all"
)

INTERMEDIATE_API_ALL_PRIVATE_PROJECTS_ENDPOINT = (
    "/intermediateAPI/project/private/get/all"
)
INTERMEDIATE_API_ALL_PUBLIC_PROJECTS_ENDPOINT = (
    "/intermediateAPI/project/public/get/all"
)
