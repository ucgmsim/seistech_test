import React, { useState, useContext, useEffect, Fragment } from "react";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";

const HazardCurveSection = () => {
  const { projectSelectedIM, setProjectSelectedIM } = useContext(GlobalContext);

  const options = [
    {
      value: "A Test",
      label: "A Test",
    },
    {
      value: "B Test",
      label: "B Test",
    },
    {
      value: "C Test",
      label: "C Test",
    },
  ];

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
        <Select
          id="project-im"
          placeholder={options.length === 0 ? "Loading..." : "Select..."}
          onChange={(e) => setProjectSelectedIM(e.value)}
          options={options}
          isDisabled={options.length === 0}
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
