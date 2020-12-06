// TODO - split constants individually
// BASE_URL (URL for Intermediate API) and MAP_BOX_TOKEN details from the .env file
export const CORE_API_BASE_URL =
  process.env.REACT_APP_CONSTANT_CORE_API_BASE_URL;

export const APP_API_ROUTE_USERDATA = "user";

export const CORE_API_ROUTE_ENSEMBLEIDS = "coreAPI/ensembleids";
export const CORE_API_ROUTE_IMIDS = "coreAPI/imids";
export const CORE_API_ROUTE_CONTEXT_MAP = "coreAPI/contextmap";
export const CORE_API_ROUTE_VS30_MAP = "coreAPI/vs30map";
export const CORE_API_ROUTE_LOCATION = "coreAPI/location";
export const CORE_API_ROUTE_STATION = "coreAPI/station";
export const CORE_API_ROUTE_HAZARD_PLOT = "coreAPI/hazard";
export const CORE_API_ROUTE_HAZARD_NZCODE = "coreAPI/hazard/nz1170p5";
export const CORE_API_ROUTE_DISAGG = "coreAPI/disagg";
export const CORE_API_ROUTE_UHS = "coreAPI/uhs";
export const CORE_API_ROUTE_UHS_NZCODE = "coreAPI/uhs/nz1170p5";
export const CORE_API_ROUTE_HAZARD_NZCODE_SOIL_CLASS =
  "coreAPI/hazard/nz1170p5/soil_class";
export const CORE_API_ROUTE_HAZARD_NZCODE_DEFAULT_PARAMS =
  "coreAPI/hazard/nz1170p5/default";
export const CORE_API_ROUTE_GMS_COMPUTE = "coreAPI/gms/ensemble_gms";
export const CORE_API_ROUTE_GMS_DEFAULT_IM_WEIGHTS =
  "coreAPI/gms/default_im_weights";
export const CORE_API_ROUTE_GMS_DEFAULT_CAUSAL_PARAMS =
  "coreAPI/gms/default_causal_params";

export const PROJECT_API_ROUTE_PROJECT_IDS = "projectAPI/ids/get";
export const PROJECT_API_ROUTE_PROJECT_SITES = "projectAPI/sites/get";
export const PROJECT_API_ROUTE_PROJECT_IMS = "projectAPI/ims/get";
export const PROJECT_API_ROUTE_PROJECT_HAZARD_GET = "projectAPI/hazard/get";
export const PROJECT_API_ROUTE_PROJECT_DISAGG_GET = "projectAPI/disagg/get";
export const PROJECT_API_ROUTE_PROJECT_DISAGG_RPS = "projectAPI/disagg/rps/get";
export const PROJECT_API_ROUTE_PROJECT_UHS_RPS = "projectAPI/uhs/rps/get";
export const PROJECT_API_ROUTE_PROJECT_UHS_GET = "projectAPI/uhs/get";
export const PROJECT_API_ROUTE_PROJECT_MAPS = "projectAPI/maps/get";

/* Download URL */
export const CORE_API_DOWNLOAD_HAZARD = "coreAPI/hazard_download";
export const CORE_API_DOWNLOAD_DISAGG = "coreAPI/disagg_download";
export const CORE_API_DOWNLOAD_UHS = "coreAPI/uhs_download";
export const CORE_API_DOWNLOAD_GMS = "coreAPI/gms_download";

/* 
  Words 
  TODO - See whether it's worth putting as constands due to structure.
  E.g., We may go up two ~ three directoris to get an access to this Constants.js
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
  Hazard Viewer
  Guide messages
*/
export const HAZARD_CURVE_WARNING_MSG =
  "Please do the following steps to see plots.";
export const HAZARD_CURVE_INSTRUCTION = [
  "Choose the Intensity Measure first.",
  "Click the compute button in the 'Hazard Curve' section to see plots.",
];
export const DISAGGREGATION_WARNING_MSG_PLOT =
  "Please do the following steps to see plots.";
export const DISAGGREGATION_WARNING_MSG_TABLE =
  "Please do the following steps to see the contribution table.";
export const DISAGGREGATION_INSTRUCTION_PLOT = [
  "Choose the Intensity Measure first.",
  "Update input fields in the 'Disaggregation' section to get probability.",
  "Click the compute button in the 'Disaggregation' section to see plots.",
];
export const DISAGGREGATION_INSTRUCTION_TABLE = [
  "Choose the Intensity Measure first.",
  "Update input fields in the 'Disaggregation' section to get probability.",
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
  Project Tabs
*/
export const PROJECT_SITE_SELECTION_WARNING_MSG =
  "Please do the following steps to see images.";
export const PROJECT_SITE_SELECTION_INSTRUCTION = [
  "Choose the Project ID.",
  "Choose the Location.",
  "Choose the VS30.",
  "Click the Get button to see an image",
];

export const PROJECT_HAZARD_CURVE_INSTRUCTION = [
  "Choose the Intensity Measure.",
  "Click the Get buton in the 'Hazard Curve' section to see plots.",
];

export const PROJECT_DISAGG_INSTRUCTION_PLOT = [
  "Choose the Intensity Measure.",
  "Choose the Return Period",
  "Click the Get buton in the 'Disaggregation' section to see plots.",
];

export const PROJECT_DISAGG_INSTRUCTION_TABLE = [
  "Choose the Intensity Measure.",
  "Choose the Return Period",
  "Click the Get buton in the 'Disaggregation' section to see contribution table.",
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
  Hazard Curve Plots
*/
export const PLOT_MARGIN = {
  l: 60,
  r: 50,
  b: 50,
  t: 30,
  pad: 4,
};
