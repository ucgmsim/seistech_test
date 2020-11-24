import React, { createContext, useState, useEffect } from "react";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import PropTypes from "prop-types";
import { handleErrors } from "utils/Utils";

import * as CONSTANTS from "constants/Constants";

export const Context = createContext({});

export const Provider = (props) => {
  const { children } = props;

  /*
    Hazard Analysis Tab
  */

  // Site Selection
  const [station, setStation] = useState("");
  const [vs30, setVS30] = useState("");
  const [defaultVS30, setDefaultVS30] = useState("");
  const [locationSetClick, setLocationSetClick] = useState(null);

  const [selectedEnsemble, setSelectedEnsemble] = useState(
    CONSTANTS.APP_LOCATION_DEFAULT_ENSEMBLE
  );
  const [siteSelectionLat, setSiteSelectionLat] = useState("");
  const [siteSelectionLng, setSiteSelectionLng] = useState("");
  // For MapBox as using above two will send request everytime users change its value
  const [mapBoxCoordinate, setMapBoxCoordinate] = useState({
    lat: CONSTANTS.DEFAULT_MAPBOX_LAT,
    lng: CONSTANTS.DEFAULT_MAPBOX_LNG,
  });

  // For IMs
  // The only exception regards naming conventions as 'ims' seems very odd
  const [IMs, setIMs] = useState([]);

  // Seismic Hazard & GMS
  const [IMVectors, setIMVectors] = useState([]);

  //  Seismic Hazard
  const [selectedIM, setSelectedIM] = useState(null);
  const [disaggAnnualProb, setDisaggAnnualProb] = useState(
    CONSTANTS.DEFAULT_ANNUAL_PROB
  );

  const [hazardCurveComputeClick, setHazardCurveComputeClick] = useState(null);

  const [disaggComputeClick, setDisaggComputeClick] = useState(null);

  const [uhsComputeClick, setUHSComputeClick] = useState(null);

  /*
    TODO - Future usage
  */
  const [nzs1170ComputeClick, setNZS1170ComputeClick] = useState("false");
  const [showNZS1170, setShowNZS1170] = useState("false");

  const [uhsRateTable, setUHSRateTable] = useState([]);

  const [nzs1170Input, setNZS1170Input] = useState();
  const [nzs1170SiteClass, setNZS1170SiteClass] = useState("A");

  // GMS
  const [computedGMS, setComputedGMS] = useState(null);

  /*
    Project Tab
  */
  // Site Selection
  // Response for Location is an object and we need an array for dropdowns
  const [projectLocations, setProjectLocations] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [projectLocationCode, setProjectLocationCode] = useState({});
  const [projectVS30, setProjectVS30] = useState(null);
  const [projectLocation, setProjectLocation] = useState(null);

  // Seismic Hazard
  const [projectSelectedIM, setProjectSelectedIM] = useState(null);
  const [projectIMs, setProjectIMs] = useState([]);

  /* 
    User Permissions
  */

  const { isAuthenticated, getTokenSilently } = useAuth0();

  const [getUserData, setGetUserData] = useState(true);

  // TODO - need to investigate on this hook's usage, seems useless but not sure.
  const [userGroups, setUserGroups] = useState([]);
  // console.log(userGroups)
  const getEnabledTabsFromUserGroups = (userGroups) => {
    let tabs = [];

    userGroups.forEach((ug) => {
      switch (ug) {
        case "1":
          tabs.push("hazard:hazard");
          break;

        case "2":
          tabs.push("hazard:disagg");
          break;

        case "3":
          tabs.push("hazard:uhs");
          break;

        default:
          break;
      }
    });

    // console.log("tabs=" + JSON.stringify(tabs));

    return tabs;
  };

  const [enabledTabs, setEnabledTabs] = useState([]);

  useEffect(() => {
    // To get user data, we need to check that it is authenticated first
    if (isAuthenticated) {
      const callGetUserData = async () => {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL + CONSTANTS.APP_API_ROUTE_USERDATA,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then(handleErrors)
          .then(async (response) => {
            const ud = await response.json();

            let userPermissions = ud.permissions;

            setEnabledTabs(userPermissions);
          });
      };
      callGetUserData();
    }
  }, []);

  /* 
    Might have to use it in the future when we deal with error handling with users permissions but not now
    Depends on business logic I guess
  */
  // useEffect(() => {
  //   console.log("enabledTabs " + JSON.stringify(enabledTabs));
  // }, [enabledTabs]);

  const isTabEnabled = (tabName) => {
    return enabledTabs.includes(tabName);
  };

  const uhsTableAddRow = (row) => {
    if (
      uhsRateTable.length === 0 &&
      uhsRateTable[0] === CONSTANTS.UHS_TABLE_MESSAGE
    ) {
      uhsRateTable.length = 0;
    }
    uhsRateTable.push(row);
    setUHSRateTable(Array.from(uhsRateTable));
  };

  const uhsTableDeleteRow = (idx) => {
    uhsRateTable.splice(idx, 1);
    setUHSRateTable(Array.from(uhsRateTable));
  };

  // Make the context object:
  const globalContext = {
    /*
     User Auth
    */
    isTabEnabled,

    /*
      Hazard Analysis Tab
    */

    //Site Selection
    station,
    setStation,
    vs30,
    setVS30,
    defaultVS30,
    setDefaultVS30,
    locationSetClick,
    setLocationSetClick,

    selectedEnsemble,
    setSelectedEnsemble,
    siteSelectionLat,
    setSiteSelectionLat,
    siteSelectionLng,
    setSiteSelectionLng,

    // Seismic Hazard tab's Hazard Curve & GMS tab's IM Type
    IMs,
    setIMs,

    // MapBox
    mapBoxCoordinate,
    setMapBoxCoordinate,

    // Seismic Hazard
    selectedIM,
    setSelectedIM,
    disaggAnnualProb,
    setDisaggAnnualProb,
    hazardCurveComputeClick,
    setHazardCurveComputeClick,
    disaggComputeClick,
    setDisaggComputeClick,
    uhsComputeClick,
    setUHSComputeClick,

    nzs1170ComputeClick,
    setNZS1170ComputeClick,
    showNZS1170,
    setShowNZS1170,

    uhsRateTable,
    setUHSRateTable,
    uhsTableAddRow,
    uhsTableDeleteRow,

    nzs1170Input,
    setNZS1170Input,
    nzs1170SiteClass,
    setNZS1170SiteClass,

    // GMS
    computedGMS,
    setComputedGMS,
    IMVectors,
    setIMVectors,

    /*
      Project Tab
    */
    // Site Selection
    projectLocations,
    setProjectLocations,
    projectId,
    setProjectId,
    projectLocationCode,
    setProjectLocationCode,
    projectVS30,
    setProjectVS30,
    projectLocation,
    setProjectLocation,

    // Seismic Hazard
    projectSelectedIM,
    setProjectSelectedIM,
    projectIMs,
    setProjectIMs,
  };

  // pass the value in provider and return
  return <Context.Provider value={globalContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

Provider.propTypes = {
  uhsRateTable: PropTypes.array,
};
