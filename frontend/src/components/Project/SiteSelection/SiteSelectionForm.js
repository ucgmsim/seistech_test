import React, { Fragment, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import ProjectSelect from "components/common/ProjectSelect";
import { handleErrors, sortIMs } from "utils/Utils";

import "assets/style/HazardForms.css";

const SiteSelectionForm = () => {
  const {
    setProjectIMs,
    setProjectDisagRPs,
    setProjectUHSRPs,
    setProjectId,
    setProjectVS30,
    setProjectLocation,
    setProjectLocationCode,
    setProjectSiteSelectionGetClick,
  } = useContext(GlobalContext);

  const { getTokenSilently } = useAuth0();

  // Response for Project ID option and is an array, can use straightaway
  const [projectIdOptions, setProjectIdOptions] = useState([]);

  const [localProjectId, setLocalProjectId] = useState(null);
  const [localLocation, setLocalLocation] = useState(null);
  const [localVS30, setLocalVS30] = useState(null);
  const [localProjectLocations, setLocalProjectLocations] = useState([]);
  // Using localProjectLocations which is an object to create two different arrays for dropdowns
  const [locationOptions, setLocationOptions] = useState([]);
  const [vs30Options, setVs30Options] = useState([]);

  // Getting Project IDs
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getProjectID = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL + CONSTANTS.CORE_API_ROUTE_PROJECT_IDS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: signal,
          }
        )
          .then(handleErrors)
          .then(async (response) => {
            const responseData = await response.json();
            setProjectIdOptions(responseData["project_ids"]);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getProjectID();

    return () => {
      abortController.abort();
    };
  }, []);

  // Getting location, IMs (for Hazard Curve) and RPs (for Disaggregation and UHS) when ID gets changed
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getLocation = async () => {
      if (localProjectId !== null) {
        try {
          const token = await getTokenSilently();

          await Promise.all([
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.CORE_API_ROUTE_PROJECT_SITES +
                `?project_id=${localProjectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.CORE_API_ROUTE_PROJECT_IMS +
                `?project_id=${localProjectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.CORE_API_ROUTE_PROJECT_DISAGG_RPS +
                `?project_id=${localProjectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.CORE_API_ROUTE_PROJECT_UHS_RPS +
                `?project_id=${localProjectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
          ])
            .then(handleErrors)
            .then(async ([location, im, disaggRPs, uhsRPs]) => {
              const responseLocationData = await location.json();
              const responseIMData = await im.json();
              const responseDisaggRPData = await disaggRPs.json();
              const responseUHSRPData = await uhsRPs.json();
              // Need to create another object based on the response (Object)
              // To be able to use in Dropdown, react-select
              setLocalProjectLocations(responseLocationData["locations"]);
              // Setting IMs
              setProjectIMs(sortIMs(responseIMData["ims"]));
              // Setting RPs
              setProjectDisagRPs(responseDisaggRPData["rps"]);
              setProjectUHSRPs(responseUHSRPData["rps"]);
              // Reset dropdowns
              setLocalLocation(null);
              setLocalVS30(null);
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    getLocation();

    return () => {
      abortController.abort();
    };
  }, [localProjectId]);

  // Based on the location's response, we create an array for Location dropdown
  // Also create a special object to create
  useEffect(() => {
    // We originally set localProjectLocations as an array but after update with the response
    // It changes to object and object.length is undefined which is not 0
    if (localProjectLocations.length !== 0) {
      let tempOptionArray = [];
      let tempLocationCodeObj = {};
      for (const key of Object.keys(localProjectLocations)) {
        // Only pushing names into an array, ex: Christchurch and Dunedin
        tempOptionArray.push(localProjectLocations[key]["name"]);
        // Looks like { Christchurch: chch, Dunedin: dud}, to get station code easy
        tempLocationCodeObj[localProjectLocations[key]["name"]] = key;
      }
      setLocationOptions(tempOptionArray);
      setProjectLocationCode(tempLocationCodeObj);
    }
  }, [localProjectLocations]);

  // Based on the chosen Location, we create an array for VS30 dropdown
  useEffect(() => {
    if (localLocation !== null) {
      for (const key of Object.keys(localProjectLocations)) {
        if (localLocation === localProjectLocations[key]["name"]) {
          setVs30Options(localProjectLocations[key]["vs30"]);
          // Reset the VS30 value
          setLocalVS30(null);
        }
      }
    }
  }, [localLocation]);

  const setGlobalVariables = () => {
    setProjectId(localProjectId);
    setProjectLocation(localLocation);
    setProjectVS30(localVS30);
    setProjectSiteSelectionGetClick(uuidv4());
  };

  return (
    <Fragment>
      <div className="form-row form-section-title">Project ID</div>
      <div className="form-group">
        <ProjectSelect
          id="project-id-select"
          value={localProjectId}
          setSelect={setLocalProjectId}
          options={projectIdOptions}
        />
      </div>

      <div className="form-row form-section-title">Location</div>
      <div className="form-group">
        <ProjectSelect
          id="location-select"
          value={localLocation}
          setSelect={setLocalLocation}
          options={locationOptions}
          placeholder="Please select the Project ID first..."
        />
      </div>

      <div className="form-row form-section-title">VS30</div>
      <div className="form-group">
        <ProjectSelect
          id="vs-30-select"
          value={localVS30}
          setSelect={setLocalVS30}
          options={vs30Options}
          placeholder="Please select the Location first..."
        />
      </div>

      <div className="form-group">
        <button
          id="project-site-selection-get"
          type="button"
          className="btn btn-primary mt-2"
          disabled={
            localProjectId === null ||
            localLocation === null ||
            localVS30 === null
          }
          onClick={() => setGlobalVariables()}
        >
          Get
        </button>
      </div>
    </Fragment>
  );
};

export default SiteSelectionForm;
