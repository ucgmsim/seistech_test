// TODO - split constants individually
// BASE_URL (URL for Intermediate API) and MAP_BOX_TOKEN details from the .env file
export const CORE_API_BASE_URL =
  process.env.REACT_APP_CONSTANT_CORE_API_BASE_URL;

export const APP_API_ROUTE_USERDATA = "user";

export const CORE_API_ROUTE_ENSEMBLEIDS = "coreAPI/ensembleids";
export const CORE_API_ROUTE_IMIDS = "coreAPI/imids";
export const CORE_API_ROUTE_CONTEXT_MAP = "coreAPI/contextmap";
export const CORE_API_ROUTE_VS30_MAP = "coreAPI/vs30map";
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

// This endpoint will eventually replace when we implement DB properly
// As this function reads from Available_Project table (A bridge table between User and Project)
// export const PROJECT_API_ROUTE_PROJECT_IDS = "projectAPI/available_ids/get";
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

export const PROJECT_API_DOWNLOAD_HAZARD = "projectAPI/hazard_download";
export const PROJECT_API_DOWNLOAD_DISAGG = "projectAPI/disagg_download";
export const PROJECT_API_DOWNLOAD_UHS = "projectAPI/uhs_download";
export const PROJECT_API_DOWNLOAD_GMS = "projectAPI/gms_download";

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
    "Cras ex nunc, venenatis eu facilisis id, finibus ac odio. Phasellus mattis, nisl hendrerit cursus convallis, velit nibh sollicitudin ante, ut luctus tellus orci nec nunc. Maecenas molestie urna nec congue malesuada. In hac habitasse platea dictumst. Ut aliquam fermentum urna, sit amet varius eros sollicitudin eget. Donec bibendum aliquam eleifend. Etiam condimentum faucibus lacus sit amet sagittis. Maecenas volutpat metus vel dolor gravida sodales. Integer ligula ipsum, volutpat sit amet erat vitae, pharetra aliquet ex. Aliquam ante neque, molestie vitae risus nec, pretium mattis eros. Ut porta imperdiet orci sit amet lobortis. Cras auctor euismod lorem vitae tempus. Aliquam semper turpis iaculis, egestas libero quis, efficitur odio.",
  SITE_SELECTION_SITE_CONDITION:
    "Sed vehicula tempus diam quis tincidunt. Phasellus scelerisque mi vel augue tincidunt, ut condimentum felis scelerisque. Vestibulum eget convallis mauris, nec malesuada sapien. Proin condimentum elit vel ullamcorper tristique. Pellentesque posuere ligula sed nibh egestas, et ornare elit convallis. Sed nulla mi, imperdiet ac lacus sit amet, varius sodales tellus. Nulla mollis, lorem vel ultrices lobortis, lorem dolor accumsan arcu, nec vulputate felis quam sit amet lectus. Sed quis tempor massa. Nam cursus arcu ligula, nec maximus justo scelerisque in. Quisque nec turpis magna.",
  HAZARD_HAZARD:
    "Phasellus tristique et nunc non venenatis. Vestibulum lacinia dolor a nulla volutpat consectetur. Aenean sit amet nisi libero. Cras facilisis tellus in ligula posuere, in porttitor augue porta. Vivamus consequat vestibulum lacus ut imperdiet. Proin ante nisi, elementum sit amet sodales sed, accumsan ut velit. Ut non mi dictum, iaculis massa nec, molestie nisi. Suspendisse a volutpat nisl. Cras convallis, metus et dapibus hendrerit, nisl ante maximus risus, sed sodales neque lectus vitae felis.",
  HAZARD_DISAGG:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et magna dapibus, elementum quam in, eleifend turpis. Nunc dignissim risus sit amet justo bibendum, sed ullamcorper elit rhoncus. Proin eu nisl feugiat felis hendrerit maximus. Sed id volutpat ex. Donec bibendum tortor quis commodo ullamcorper. Donec dapibus malesuada nulla ac auctor. Vestibulum cursus erat tortor. Donec sit amet nunc rutrum, pretium urna in, egestas diam. Sed tincidunt, magna nec scelerisque fringilla, dui nunc eleifend quam, sit amet placerat erat enim sit amet metus. Proin et sodales risus. Morbi ac ultrices neque.",
  HAZARD_UHS:
    "Phasellus posuere dolor sed tincidunt efficitur. Nunc nunc massa, euismod sed magna eu, lobortis cursus dui. Cras eu dolor in nunc finibus vestibulum. Donec auctor sit amet lectus ut lobortis. Proin interdum porta volutpat. Praesent vitae rutrum massa. Mauris eu massa metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi ultrices augue risus. Etiam turpis justo, commodo ac ultricies eget, tempor id lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec lacinia orci ex, eu egestas nibh sagittis eget.",
  HAZARD_NZCODE:
    "Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam fermentum hendrerit ex et pellentesque. Donec ac viverra quam, sed finibus risus. Vivamus in euismod nisi. Duis at tincidunt risus. Sed rhoncus leo in orci lacinia tempus. Donec ut dolor a enim pellentesque ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam erat diam, lacinia ut mi sit amet, viverra sagittis nibh. In ac odio iaculis, dignissim lacus finibus, cursus augue. Nullam a mi id quam commodo gravida. Proin vitae diam blandit, lacinia orci non, mattis lectus.",
  PROJECT_SITE_SELECTION_PROJECT_ID:
    "Integer urna justo, consectetur ut gravida a, lobortis vitae quam. Quisque quam lectus, sagittis vel lorem ac, malesuada vulputate nibh. Vivamus et suscipit leo, non placerat quam. Duis sapien lacus, vestibulum nec quam in, hendrerit fringilla nisl. Ut a commodo quam, accumsan suscipit velit. Vestibulum eu nunc quam. Donec ante turpis, ornare vitae feugiat vitae, aliquam sit amet erat. Duis efficitur ultricies orci a aliquet. Vivamus sit amet odio varius, convallis eros ac, egestas mi. Integer porttitor elit eget sapien scelerisque tincidunt. Morbi id metus quis augue mollis sollicitudin. Suspendisse malesuada purus sit amet sapien aliquet ullamcorper. Morbi eget commodo ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras nec maximus diam.",
  PROJECT_SITE_SELECTION_LOCATION:
    "Mauris vitae lectus varius, auctor nunc nec, tincidunt est. Aenean sed lacinia nunc. Sed ac bibendum eros. Nam posuere tempor volutpat. Integer vitae odio placerat, fringilla massa a, aliquet eros. In viverra eu lacus in feugiat. Nulla facilisi. Fusce est est, mollis quis tellus eget, vehicula porttitor nisl. Sed maximus pellentesque sapien, a congue erat pharetra eget. Suspendisse a bibendum mi. Curabitur sit amet viverra orci. Praesent tincidunt ornare orci, eu fermentum nibh. Curabitur a aliquam dolor, vitae efficitur velit. Ut vehicula egestas mauris et ornare.",
  PROJECT_SITE_SELECTION_VS30:
    "Praesent tortor massa, consectetur eu pulvinar a, placerat sed lacus. Etiam vehicula id ante eu lobortis. Phasellus convallis mauris urna, vitae sollicitudin diam lacinia sit amet. Nulla ultricies, nisi quis blandit cursus, mi est condimentum nulla, et viverra ligula dolor nec orci. Quisque pulvinar magna ac quam tincidunt pulvinar id et nunc. Sed lacinia consequat urna quis vestibulum. Cras nec metus a justo sollicitudin varius sit amet vitae erat. Fusce feugiat tellus eget fringilla iaculis. Proin rutrum justo laoreet turpis consectetur, quis eleifend lorem gravida. Morbi interdum viverra faucibus. Vestibulum dui ipsum, pellentesque a tempor tincidunt, luctus fringilla diam. Aenean ultrices iaculis mi quis suscipit. Donec ligula lectus, commodo sit amet dui non, finibus ultrices turpis. Sed et commodo neque. Cras non ligula ultricies, mollis mi in, mattis ipsum.",
  PROJECT_HAZARD:
    "Aliquam vitae tellus venenatis nunc suscipit tristique vel in mauris. Maecenas aliquam feugiat posuere. Quisque gravida vitae libero sed egestas. Etiam pharetra, diam eu placerat ultrices, velit nibh consequat arcu, vel tempus nulla nibh vitae dui. Ut a cursus augue. Quisque tincidunt cursus lacus sed lobortis. Quisque eget porta odio. Morbi in mollis nisl. Donec placerat ligula in nibh maximus elementum. Curabitur imperdiet volutpat efficitur. Nunc bibendum mi non arcu finibus, et scelerisque nisl ultricies. Maecenas id felis volutpat, rhoncus sem sed, blandit erat. Duis blandit interdum felis ac egestas. Nulla eget sem a nisi consequat pretium. Nunc hendrerit efficitur metus non faucibus. In a sapien lobortis, pulvinar erat nec, efficitur est.",
  PROJECT_DISAGG:
    "Morbi tristique pulvinar feugiat. Donec euismod ac justo id iaculis. Phasellus a sem nulla. Nam vestibulum est quis commodo pellentesque. Suspendisse tempor porttitor efficitur. Phasellus elit sapien, blandit quis diam in, tempor maximus augue. Vestibulum mi urna, sagittis quis cursus vitae, maximus vitae ex. Vivamus at ante non lorem dictum cursus eu eu dolor. Suspendisse interdum rutrum maximus. Vivamus eget justo nulla.",
  PROJECT_UHS:
    "Proin egestas iaculis mi, at vulputate nulla mattis vitae. Maecenas cursus sit amet nulla finibus lobortis. Sed consequat nibh a augue lobortis, ut congue quam vestibulum. Phasellus imperdiet elit id mauris rhoncus feugiat nec id felis. In elementum, eros vitae sagittis pretium, felis erat efficitur erat, vel mollis nunc velit in libero. Nunc commodo ultrices mauris gravida dignissim. Phasellus vel tempus arcu. Praesent non mauris libero. Etiam vitae nulla pretium, imperdiet nisi et, tristique sem. Nulla sed dapibus eros. Maecenas cursus sodales urna, ut ultrices purus varius sed. Vivamus lacinia consequat leo nec blandit. Fusce sit amet molestie tellus, quis tristique libero. Cras sit amet est sit amet enim lobortis efficitur. Aliquam erat volutpat.",
};
