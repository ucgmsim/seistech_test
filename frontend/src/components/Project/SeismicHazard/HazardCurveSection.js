import React, { useState, useContext, useEffect, Fragment } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";

import ProjectSelect from "components/common/ProjectSelect";

const HazardCurveSection = () => {
  const { projectSelectedIM, setProjectSelectedIM } = useContext(GlobalContext);

  const options = ["A Test", "B Test", "C Test"];

  const displayInConsole = () => {
    console.log(`Im chosen IM: ${projectSelectedIM}`);
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
          setSelect={setProjectSelectedIM}
          options={options}
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
