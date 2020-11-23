import React, { Fragment, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { disableScrollOnNumInput, handleErrors } from "utils/Utils";
import Select from "react-select";

import "assets/style/HazardForms.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiteSelectionForm = () => {
  const { getTokenSilently } = useAuth0();

  const [projectId, setProjectId] = useState(null);
  const [location, setLocation] = useState(null);
  const [vs30, setVs30] = useState(null);

  // Will be replaced to the responses from API
  const projectIdOptions = [
    {
      value: "Project A Test",
      label: "Project A Test",
    },
    {
      value: "Project B Test",
      label: "Project B Test",
    },
    {
      value: "Project C Test",
      label: "Project C Test",
    },
  ];

  const locationOptions = [
    {
      value: "Location A Test",
      label: "Location A Test",
    },
    {
      value: "Location B Test",
      label: "Location B Test",
    },
    {
      value: "Location C Test",
      label: "Location C Test",
    },
  ];

  const vs30Options = [
    {
      value: "VS30 A Test",
      label: "VS30 A Test",
    },
    {
      value: "VS30 B Test",
      label: "VS30 B Test",
    },
    {
      value: "VS30 C Test",
      label: "VS30 C Test",
    },
  ];

  const displayInConsole = () => {
    console.log(`Im Project ID: ${projectId}`);
    console.log(`Im location: ${location}`);
    console.log(`Im vs30: ${vs30}`);
  };

  return (
    <Fragment>
      <div className="form-row form-section-title">Project ID</div>
      <Select
        id="project-id-select"
        placeholder={projectIdOptions.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setProjectId(e.value)}
        options={projectIdOptions}
        isDisabled={projectIdOptions.length === 0}
      />
      <div className="form-row form-section-title">Location</div>
      <Select
        id="location-select"
        placeholder={locationOptions.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setLocation(e.value)}
        options={locationOptions}
        isDisabled={locationOptions.length === 0}
      />
      <div className="form-row form-section-title">VS 30</div>
      <Select
        id="vs-30-select"
        placeholder={vs30Options.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setVs30(e.value)}
        options={vs30Options}
        isDisabled={vs30Options.length === 0}
      />

      <button onClick={displayInConsole}>
        Click Me to display whats chosen.
      </button>
    </Fragment>
  );
};

export default SiteSelectionForm;
