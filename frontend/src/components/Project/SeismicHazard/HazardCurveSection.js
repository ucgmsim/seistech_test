import React, { useState, useContext, useEffect, Fragment } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";

import ProjectSelect from "components/common/ProjectSelect";

const HazardCurveSection = () => {
  const {
    projectSelectedIM,
    setProjectSelectedIM,
    projectIMs,
    setProjectHazardCurveGetClick,
  } = useContext(GlobalContext);

  const [localSelectedIM, setLocalSelectedIM] = useState(null);

  // Reset local variable to null when global changed to null (Reset)
  useEffect(() => {
    if (projectSelectedIM === null) {
      setLocalSelectedIM(null);
    }
  }, [projectSelectedIM]);

  const getHazardCurve = () => {
    setProjectSelectedIM(localSelectedIM);
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
          value={localSelectedIM}
          setSelect={setLocalSelectedIM}
          options={projectIMs}
        />
      </div>

      <div className="form-group">
        <button
          id="project-hazard-curve-get-btn"
          type="button"
          className="btn btn-primary"
          disabled={localSelectedIM === null}
          onClick={() => {
            getHazardCurve();
          }}
        >
          Get
        </button>
      </div>
    </Fragment>
  );
};

export default HazardCurveSection;
