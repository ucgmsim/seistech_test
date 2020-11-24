import React, { useState, useContext, useEffect, Fragment } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";

import ProjectSelect from "components/common/ProjectSelect";

const HazardCurveSection = () => {
  const {
    projectSelectedIM,
    setProjectSelectedIM,
    projectIMs,
    projectId,
    projectVS30,
    projectLocation,
    projectLocationCode,
    setProjectHazardCurveGetClick,
  } = useContext(GlobalContext);

  const displayInConsole = () => {
    console.log(`Im chosen IM: ${projectSelectedIM}`);
    console.log(`Im chosen Project ID: ${projectId}`);
    console.log(`IM chosen project VS30: ${projectVS30}`);
    console.log(`IM CHOSEN PROJECT LOCATION: ${projectLocation}`);
    console.log(
      `IM CHOSEN PROJECT LOCATION CODE: ${projectLocationCode[projectLocation]}`
    );
    setProjectHazardCurveGetClick(uuidv4());
  };

  return (
    <Fragment>
      <div className="form-group form-section-title">
        <span>Hazard Curve</span>
      </div>
      <div className="form-group">
        <label
          id="label-project-im"
          htmlFor="project-im"
          className="control-label"
        >
          Intensity Measure
        </label>
        <ProjectSelect
          id="project-im"
          value={projectSelectedIM}
          setSelect={setProjectSelectedIM}
          options={projectIMs}
        />
      </div>

      <div className="form-group">
        <button
          id="project-hazard-curve-get-btn"
          type="button"
          className="btn btn-primary"
          disabled={projectSelectedIM === null}
          onClick={() => {
            displayInConsole();
          }}
        >
          Get
        </button>
      </div>
    </Fragment>
  );
};

export default HazardCurveSection;
