// TODO - split constants individually
// BASE_URL (URL for Intermediate API) and MAP_BOX_TOKEN details from the .env file
export const CORE_API_BASE_URL =
  process.env.REACT_APP_CONSTANT_CORE_API_BASE_URL;

export const CORE_API_ENSEMBLE_IDS_ENDPOINT = "coreAPI/ensembleids/get";
export const CORE_API_IMS_ENDPOINT = "coreAPI/ims/get";
export const CORE_API_CONTEXT_MAP_ENDPOINT = "coreAPI/contextmap/get";
export const CORE_API_VS30_MAP_ENDPOINT = "coreAPI/vs30map/get";
export const CORE_API_STATION_ENDPOINT = "coreAPI/station/get";

export const CORE_API_HAZARD_ENDPOINT = "coreAPI/hazard/get";
export const CORE_API_HAZARD_NZS1170P5_ENDPOINT = "coreAPI/hazard/nz1170p5/get";
export const CORE_API_HAZARD_DISAGG_ENDPOINT = "coreAPI/disagg/get";
export const CORE_API_HAZARD_UHS_ENDPOINT = "coreAPI/uhs/get";
export const CORE_API_HAZARD_UHS_NZS1170P5_ENDPOINT =
  "coreAPI/uhs/nz1170p5/get";
export const CORE_API_HAZARD_NZS1170P5_SOIL_CLASS_ENDPOINT =
  "coreAPI/hazard/nz1170p5/soil_class/get";
export const CORE_API_HAZARD_NZS1170P5_DEFAULT_PARAMS_ENDPOINT =
  "coreAPI/hazard/nz1170p5/default/get";

export const CORE_API_GMS_ENDPOINT = "coreAPI/gms/ensemble_gms/get";
export const CORE_API_GMS_DEFAULT_IM_WEIGHTS_ENDPOINT =
  "coreAPI/gms/default_im_weights/get";
export const CORE_API_GMS_DEFAULT_CAUSAL_PARAMS_ENDPOINT =
  "coreAPI/gms/default_causal_params/get";
export const CORE_API_GMS_IMS_ENDPOINT_ENDPOINT =
  "coreAPI/gms/ensemble_gms/ims/get";
export const CORE_API_GMS_DATASETS_ENDPOINT =
  "coreAPI/gms/ensemble_gms/datasets/get";

// This endpoint will eventually replace when we implement DB properly
// As this function reads from Available_Project table (A bridge table between User and Project)
export const PROJECT_API_PROJECT_IDS_ENDPOINT = "projectAPI/ids/get";
export const PROJECT_API_SITES_ENDPOINT = "projectAPI/sites/get";
export const PROJECT_API_IMS_ENDPOINT = "projectAPI/ims/get";
export const PROJECT_API_MAPS_ENDPOINT = "projectAPI/maps/get";

export const PROJECT_API_HAZARD_ENDPOINT = "projectAPI/hazard/get";
export const PROJECT_API_HAZARD_DISAGG_ENDPOINT = "projectAPI/disagg/get";
export const PROJECT_API_HAZARD_DISAGG_RPS_ENDPOINT =
  "projectAPI/disagg/rps/get";
export const PROJECT_API_HAZARD_UHS_ENDPOINT = "projectAPI/uhs/get";
export const PROJECT_API_HAZARD_UHS_RPS_ENDPOINT = "projectAPI/uhs/rps/get";

/* Download URL */
export const CORE_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT =
  "coreAPI/hazard/download";
export const CORE_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT =
  "coreAPI/disagg/download";
export const CORE_API_HAZARD_UHS_DOWNLOAD_ENDPOINT = "coreAPI/uhs/download";
export const CORE_API_GMS_DOWNLOAD_ENDPOINT = "coreAPI/gms/download";

export const PROJECT_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT =
  "projectAPI/hazard/download";
export const PROJECT_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT =
  "projectAPI/disagg/download";
export const PROJECT_API_HAZARD_UHS_DOWNLOAD_ENDPOINT =
  "projectAPI/uhs/download";
export const PROJECT_API_GMS_DOWNLOAD_ENDPOINT = "projectAPI/gms/download";

/* Intermediate API call*/
export const INTERMEDIATE_API_AUTH0_USER_INFO_ENDPOINT =
  "intermediateAPI/auth0/user/permissions/get";
export const INTERMEDIATE_API_AUTH0_USERS_ENDPOINT =
  "intermediateAPI/auth0/users/get";

export const INTERMEDIATE_API_USER_PROJECTS_ENDPOINT =
  "intermediateAPI/user/projects/get";
export const INTERMEDIATE_API_USER_ALLOCATE_PROJECTS_ENDPOINT =
  "intermediateAPI/user/allocate_projects";
export const INTERMEDIATE_API_USER_REMOVE_PROJECTS_ENDPOINT =
  "intermediateAPI/user/remove_projects";

export const INTERMEDIATE_API_ALL_PERMISSIONS_ENDPOINT =
  "intermediateAPI/permission/get/all";

export const INTERMEDIATE_API_ALL_USERS_PERMISSIONS_ENDPOINT =
  "intermediateAPI/users_permissions/get/all";

export const INTERMEDIATE_API_ALL_USERS_PROJECTS_ENDPOINT =
  "intermediateAPI/users_projects/get/all";

export const INTERMEDIATE_API_ALL_PRIVATE_PROJECTS_ENDPOINT =
  "intermediateAPI/project/private/get/all";
export const INTERMEDIATE_API_ALL_PUBLIC_PROJECTS_ENDPOINT =
  "intermediateAPI/project/public/get/all";

/* 
  Words 
  TODO - See whether it's worth putting as constants due to structure.
  E.g., We may go up two ~ three directories to get access to this Constants.js
  */

export const HAZARD_ANALYSIS = "Hazard Analysis";
export const SITE_SELECTION = "Site Selection";
export const SEISMIC_HAZARD = "Seismic Hazard";
export const GMS = "GMS";
export const HAZARD_CURVE = "Hazard Curve";
export const DISAGGREGATION = "Disaggregation";
export const UNIFORM_HAZARD_SPECTRUM = "Uniform Hazard Spectrum";
export const ENSEMBLE_BRANCHES = "Ensemble Branches";
export const FAULT_DISTRIBUTED_SEISMICITY_CONTRIBUTION =
  "Fault/distributed seismicity contribution";
export const DOWNLOAD_DATA = "Download data";

export const APP_LOCATION_DEFAULT_ENSEMBLE = "v20p5emp";

export const APP_UI_CONTRIB_TABLE_ROWS = 10;
export const APP_UI_VS30_DP = 1;
export const APP_UI_SIGFIGS = 4;
export const APP_UI_UHS_RATETABLE_RATE_SIGFIGS = 3;

export const UHS_TABLE_MESSAGE = "No rates added";

/* 
  For Site Selection
*/

export const DEFAULT_LAT = process.env.REACT_APP_DEFAULT_LAT || "";
export const DEFAULT_LNG = process.env.REACT_APP_DEFAULT_LNG || "";
export const ENV = process.env.REACT_APP_ENV;

export const SITE_SELECTION_VS30_TITLE = "VS30";

/* 
  Guide Messages
  Site Selection - Regional & Vs30
*/
export const SITE_SELECTION_VS30_MSG =
  "Please do the following steps to see an image.";
export const SITE_SELECTION_VS30_INSTRUCTION = [
  "Put appropriate Latitude and Longitude values.",
  "Click the Set button in the 'Location' section to see an image.",
];

export const SITE_SELECTION_REGIONAL_TITLE = "Regional";
export const SITE_SELECTION_REGIONAL_MSG =
  "Please do the following steps to see an image.";
export const SITE_SELECTION_REGIONAL_INSTRUCTION = [
  "Put appropriate Latitude and Longitude values.",
  "Click the Set button in the 'Location' section to see an image.",
];

/*
  Map Box
  Default coordinates needed, so I put our coordinates (UC Engineering Core Building)
*/
export const DEFAULT_MAPBOX_LAT = -43.521463221980085;
export const DEFAULT_MAPBOX_LNG = 172.58361319646755;
export const MAP_BOX_WIDTH = "66vw";
export const MAP_BOX_HEIGHT = "70vh";
// Needs to be changed once we (SeisTech) have an account with MapBox
export const MAP_BOX_TOKEN = process.env.REACT_APP_MAP_BOX_TOKEN;

/* 
  For HazardForm 
*/
export const PROBABILITY = "probability";
export const PROBABILITY_YEARS = "Probability/years";
export const RETURN_PERIOD = "Return Period";
export const ANNUAL_PROBABILITY = "Annual Probability";

export const DEFAULT_ANNUAL_PROB =
  process.env.REACT_APP_DEFAULT_ANNUAL_EXCEEDANCE_RATE || "";

/* 
  Guide messages
  Seismic Hazard - Hazard Viewer
*/
export const HAZARD_CURVE_GUIDE_MSG =
  "Please do the following steps to see plots.";
export const HAZARD_CURVE_INSTRUCTION = [
  "Choose the Intensity Measure first.",
  "Click the compute button in the 'Hazard Curve' section to see plots.",
];
export const DISAGGREGATION_GUIDE_MSG_PLOT =
  "Please do the following steps to see plots.";
export const DISAGGREGATION_GUIDE_MSG_TABLE =
  "Please do the following steps to see the contribution table.";
export const DISAGGREGATION_INSTRUCTION_PLOT = [
  "Choose the Intensity Measure first.",
  "Update input fields in the 'Disaggregation' section to get a probability.",
  "Click the compute button in the 'Disaggregation' section to see plots.",
];
export const DISAGGREGATION_INSTRUCTION_TABLE = [
  "Choose the Intensity Measure first.",
  "Update input fields in the 'Disaggregation' section to get a probability.",
  "Click the compute button in the 'Disaggregation' section to see the contribution table.",
];

export const UNIFORM_HAZARD_SPECTRUM_MSG =
  "Please do the following steps to see plots.";
export const UNIFORM_HAZARD_SPECTRUM_INSTRUCTION = [
  "Using input fields to find the RP you want to use",
  "Click Add button to add for calculation",
  "Click Compute button to see plots.",
];

/* 
  Guide messages
  - GMS
*/
export const GMS_VIEWER_GUIDE_MSG =
  "Please do the following steps to see plots.";
export const GMS_VIEWER_GUIDE_INSTRUCTION = [
  "Select IM from Conditioning IM Name.",
  "Choose one option from IM / Exceedance rate level then put a value.",
  "Click Get causal parameters bounds",
  "Select IM Vector(s).",
  "Click Get IM vector weights",
  "Put Number of Ground Motions.",
  "Click the Compute button.",
];

/*
  Project Tabs
*/
export const PROJECT_SITE_SELECTION_GUIDE_MSG =
  "Please do the following steps to see images.";
export const PROJECT_SITE_SELECTION_INSTRUCTION = [
  "Choose the Project ID.",
  "Choose the Location.",
  "Choose the Vs30.",
  "Click the Get button to see an image",
];

export const PROJECT_HAZARD_CURVE_INSTRUCTION = [
  "Choose the Intensity Measure.",
  "Click the Get button in the 'Hazard Curve' section to see plots.",
];

export const PROJECT_DISAGG_INSTRUCTION_PLOT = [
  "Choose the Intensity Measure.",
  "Choose the Return Period",
  "Click the Get button in the 'Disaggregation' section to see plots.",
];

export const PROJECT_DISAGG_INSTRUCTION_TABLE = [
  "Choose the Intensity Measure.",
  "Choose the Return Period",
  "Click the Get button in the 'Disaggregation' section to see contribution table.",
];

/*
  Error Messages
*/

export const ERROR_SET_DIFF_CODE = {
  DEFAULT: {
    ERROR_MSG_HEADER: "Error",
    ERROR_MSG_TITLE: "Something went wrong.",
    ERROR_MSG_BODY: "Please try again or contact us.",
  },

  400: {
    ERROR_MSG_HEADER: "400 Error",
    ERROR_MSG_TITLE: "One of the request inputs is not valid.",
    ERROR_MSG_BODY: "Please check inputs and try again.",
  },
  500: {
    ERROR_MSG_HEADER: "500 Error",
    ERROR_MSG_TITLE: "Our server is currently having issues.",
    ERROR_MSG_BODY: "Please try again later.",
  },
};

/*
  react-plotly.js configuration
*/
export const PLOT_MARGIN = {
  l: 60,
  r: 50,
  b: 50,
  t: 30,
  pad: 4,
};

/*
  Minimize the options in the modebar (plotly's menu)
*/
export const PLOT_CONFIG = {
  displayModeBar: true,
  modeBarButtonsToRemove: [
    "select2d",
    "lasso2d",
    "zoomIn2d",
    "zoomOut2d",
    "toggleSpikelines",
    "hoverCompareCartesian",
    "hoverClosestCartesian",
    "autoScale2d",
  ],
  doubleClick: "autosize",
};

/*
  Constant Tooltips Message
*/
export const TOOLTIP_MESSAGES = {
  SITE_SELECTION_LOCATION:
    "Enter the location (Lat, Lon) of the site of interest",
  SITE_SELECTION_SITE_CONDITION:
    "Enter the site parameters, such as the 30m-averaged shear-wave velocity. Default values of these parameters are estimated based on the selected location. You can either use this or manually override it with a specified value.",
  HAZARD_HAZARD:
    "Select the intensity measure of interest to compute the seismic hazard curve.",
  HAZARD_DISAGG:
    "Specify the annual exceedance rate (inverse of return period) to compute the disaggregation distribution. The adopted intensity measure is that specified in the Intensity Measure tab.",
  HAZARD_UHS:
    "Specify one or more annual exceedance rates (inverse of return period) to compute the Uniform Hazard Spectrum (UHS) for. Specified rates are displayed, which can be subsequently removed.",
  HAZARD_NZS1170P5_CODE:
    "Select the parameters of NZS1170.5:2004 to compare with the site-specific hazard results. Based on the location and Vs30 values assigned, these parameters have been estimated, but can be manually over-ridden.",
  PROJECT_SITE_SELECTION_PROJECT_ID:
    "Select the Project title from the list of available alternatives.",
  PROJECT_SITE_SELECTION_LOCATION:
    "Select the site/location of interest for this Project.",
  PROJECT_SITE_SELECTION_VS30:
    "Select the site parameters of interest for this site of interest, such as the 30m-averaged shear-wave velocity.",
  PROJECT_HAZARD:
    "Select the intensity measure of interest to compute the seismic hazard curve.",
  PROJECT_DISAGG:
    "Select the annual exceedance rate (inverse of return period) to compute the disaggregation distribution. The adopted intensity measure is that specified in the Intensity Measure tab.",
  PROJECT_UHS:
    "Select one or more annual exceedance rates (inverse of return period) to compute the Uniform Hazard Spectrum (UHS) for. Selected rates are displayed, which can be subsequently removed.",
  // GMS Section
  HAZARD_GMS_CONDITIONING_IM_NAME: "Select the conditioning intensity measure.",
  HAZARD_GMS_IM_LEVEL_EXCEEDANCE_RATE:
    "Set the value of the Conditioning IM. This can be done by either specifying this directly as the ‘IM level’, or indirectly by specifying the Exceedance Rate from which the hazard curve is used to obtain the IM level.",
  HAZARD_GMS_IM_VECTOR:
    "Select the intensity measures to include in the IM vector. Default weights for each intensity measure are assigned, which can be edited in the ‘Advanced’ fields.",
  HAZARD_GMS_NUM_GMS: "Set the number of ground motions for selection.",
  HAZARD_GMS_ADVANCED:
    "These are additional parameters for which default values are likely to be suitable for many users.  The advanced user may wish to manually deviate from these defaults. See the documentation page for additional details on the models used to compute these defaults.",
  HAZARD_GMS_CAUSAL_PARAMS_BOUNDS:
    "Specify the minimum and maximum allowable values of Magnitude, Rupture Distance, and 30m-averaged shear-wave velocity.",
  HAZARD_GMS_WEIGHTS:
    "Weights for each intensity measure in the ‘IM Vector’ used in the misfit calculation for ground-motion selection. Select the ‘renormalise’ button to normalise the weights to 1.0.",
  HAZARD_GMS_DB:
    "Select one or more databases from which prospective ground motions can be selected.",
  HAZARD_GMS_REPLICATES:
    "The number of replicates performed. This attempts to overcome statistical artifacts due to the use of Monte Carlo simulation within the ground-motion selection method. A larger number will give more stable results, but compute time will increase proportionately.",

  // Inside tab
  INNER_TAB_SITE_SELECTION:
    "This tab allows the specification of basic information about the site, including the location (Lat, Lon), and site conditions.",
  INNER_TAB_SEISMIC_HAZARD:
    "This tab provides access to site-specific seismic hazard results, including hazard curves and disaggregation for multiple intensity measures and exceedance rates (or return periods); and uniform hazard spectra.",
  INNER_TAB_GMS:
    "This tab provides access to site-specific ground-motion selection that is consistent with the site-specific seismic hazard.",
};

/*
  Hyperlinks for Tooltips
*/
export const TOOLTIP_URL = {
  HAZARD_NZS1170P5_CODE: "https://google.com",
};

/*
  GMS Labels
*/

export const GMS_LABELS = {
  mag: "Magnitude (Mw)",
  rrup: `Rupture distance (R${"rup".sub()})`,
  sf: "Scale factor (SF)",
  vs30: `30m-averaged shear-wave velocity (V${"s30".sub()})`,
};
