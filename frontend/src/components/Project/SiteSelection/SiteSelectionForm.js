import React, { Fragment, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import ProjectSelect from "components/common/ProjectSelect";
import { handleErrors, sortIMs } from "utils/Utils";

import "assets/style/HazardForms.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiteSelectionForm = () => {
  const {
    setProjectIMs,
    projectLocations,
    setProjectLocations,
    projectId,
    setProjectId,
    projectLocationCode,
    setProjectLocationCode,
    projectVS30,
    setProjectVS30,
  } = useContext(GlobalContext);

  const { getTokenSilently } = useAuth0();

  const [location, setLocation] = useState(null);

  // Response for Project ID option and is an array, can use straightaway
  const [projectIdOptions, setProjectIdOptions] = useState([]);

  // Using projectLocations which is an object to create two different arrays for dropdowns
  const [locationOptions, setLocationOptions] = useState([]);
  const [vs30Options, setVs30Options] = useState([]);

  // Getting station
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

  // Getting location and IMs (for Hazard Curve) when ID gets changed
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getLocation = async () => {
      if (projectId !== null) {
        try {
          const token = await getTokenSilently();

          await Promise.all([
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.CORE_API_ROUTE_PROJECT_SITES +
                `?project_id=${projectId}`,
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
                `?project_id=${projectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
          ])
            .then(handleErrors)
            .then(async ([location, im]) => {
              const responseLocationData = await location.json();
              const responseIMData = await im.json();
              // Need to create another object based on the response (Object)
              // To be able to use in Dropdown, react-select
              setProjectLocations(responseLocationData["locations"]);
              // Setting IMs
              setProjectIMs(sortIMs(responseIMData["ims"]));
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
  }, [projectId]);

  // Based on the location's response, we create an array for Location dropdown
  // Also create a special object to create
  useEffect(() => {
    // We originally set projectLocations as an array but after update with the response
    // It changes to object and object.length is undefined which is not 0
    if (projectLocations.length !== 0) {
      let tempOptionArray = [];
      let tempLocationCodeObj = {};
      for (const key of Object.keys(projectLocations)) {
        // Only pushing names into an array, ex: Christchurch and Dunedin
        tempOptionArray.push(projectLocations[key]["name"]);
        // Looks like { Christchurch: chch, Dunedin: dud}, to get station code easy
        tempLocationCodeObj[projectLocations[key]["name"]] = key;
      }
      setLocationOptions(tempOptionArray);
      setProjectLocationCode(tempLocationCodeObj);
    }
  }, [projectLocations]);

  // Based on the chosen Location, we create an array for VS30 dropdown
  useEffect(() => {
    if (location !== null) {
      for (const key of Object.keys(projectLocations)) {
        if (location === projectLocations[key]["name"]) {
          setVs30Options(projectLocations[key]["vs30"]);
        }
      }
    }
  }, [location]);

  const displayInConsole = () => {
    console.log(`Im Project ID: ${projectId}`);
    console.log(`Im location: ${location}`);
    console.log(`Im projectVS30: ${projectVS30}`);
    console.log(`Im the location code: ${projectLocationCode[location]}`);
  };

  return (
    <Fragment>
      <div className="form-row form-section-title">Project ID</div>
      <div className="form-group">
        <ProjectSelect
          id="project-id-select"
          setSelect={setProjectId}
          options={projectIdOptions}
        />
      </div>

      <div className="form-row form-section-title">Location</div>
      <div className="form-group">
        <ProjectSelect
          id="location-select"
          setSelect={setLocation}
          options={locationOptions}
          placeholder="Please select the Project ID first..."
        />
      </div>

      <div className="form-row form-section-title">VS30</div>
      <div className="form-group">
        <ProjectSelect
          id="vs-30-select"
          setSelect={setProjectVS30}
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
            projectId === null || location === null || projectVS30 === null
          }
          onClick={() => displayInConsole()}
        >
          Get
        </button>
      </div>
    </Fragment>
  );
};

export default SiteSelectionForm;
