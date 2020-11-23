// TODO - split constants individually
// BASE_URL (URL for Intermediate API) and MAP_BOX_TOKEN details from the .env file
export const CORE_API_BASE_URL =
  process.env.REACT_APP_CONSTANT_CORE_API_BASE_URL;

export const APP_API_ROUTE_USERDATA = "user";
export const CORE_API_ROUTE_ENSEMBLEIDS = "ensembleids";
export const CORE_API_ROUTE_IMIDS = "imids";
export const CORE_API_ROUTE_CONTEXT_MAP = "contextmap";
export const CORE_API_ROUTE_VS30_MAP = "vs30map";
export const CORE_API_ROUTE_LOCATION = "location";
export const CORE_API_ROUTE_STATION = "station";
export const CORE_API_ROUTE_HAZARD_PLOT = "hazard";
export const CORE_API_ROUTE_DISAGG = "disagg";
export const CORE_API_ROUTE_UHS = "uhs";
export const CORE_API_ROUTE_GMS_COMPUTE = "gms/ensemble_gms";
export const CORE_API_ROUTE_GMS_DEFAULT_IM_WEIGHTS = "gms/default_im_weights";
export const CORE_API_ROUTE_GMS_DEFAULT_CAUSAL_PARAMS =
  "gms/default_causal_params";
export const CORE_API_ROUTE_PROJECT_IDS = "project/ids/get";
export const CORE_API_ROUTE_PROJECT_SITES = "project/sites/get";
export const CORE_API_ROUTE_PROJECT_IMS = "project/ims/get";
export const CORE_API_ROUTE_PROJECT_HAZARD = "project/hazard/get";

/* Download URL */
export const INTE_API_DOWNLOAD_HAZARD = "hazard_download/";
export const INTE_API_DOWNLOAD_DISAGG = "disagg_download/";
export const INTE_API_DOWNLOAD_UHS = "uhs_download/";
export const INTE_API_DOWNLOAD_GMS = "gms_download/";

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
