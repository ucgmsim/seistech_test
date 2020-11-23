import React, { Fragment, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { disableScrollOnNumInput, handleErrors } from "utils/Utils";
import Select from "react-select";
import ProjectSelect from "components/common/ProjectSelect";

import "assets/style/HazardForms.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiteSelectionForm = () => {
  const { getTokenSilently } = useAuth0();

  const [projectId, setProjectId] = useState(null);
  const [location, setLocation] = useState(null);
  const [vs30, setVs30] = useState(null);

  // Will be replaced to the responses from API
  const projectIdOptions = [
    "Project A Test",
    "Project B Test",
    "Project C Test",
  ];
  const locationOptions = [
    "Project A Test",
    "Project B Test",
    "Project C Test",
  ];
  const vs30Options = ["Project A Test", "Project B Test", "Project C Test"];

  const displayInConsole = () => {
    console.log(`Im Project ID: ${projectId}`);
    console.log(`Im location: ${location}`);
    console.log(`Im vs30: ${vs30}`);
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
        />
      </div>

      <div className="form-row form-section-title">VS30</div>
      <div className="form-group">
        <ProjectSelect
          id="vs-30-select"
          setSelect={setVs30}
          options={vs30Options}
        />
      </div>

      <div className="form-group">
        <button
          id="project-site-selection-get"
          type="button"
          className="btn btn-primary mt-2"
          disabled={projectId === null || location === null}
          onClick={() => displayInConsole()}
        >
          Get
        </button>
      </div>
    </Fragment>
  );
};

export default SiteSelectionForm;
