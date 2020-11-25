import React, { useState, useContext, useEffect, Fragment } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import ProjectSelect from "components/common/ProjectSelect";

const HazardCurveSection = () => {
  const {
    projectRPs,
    projectSelectedIM,
    setProjectSelectedDisagRP,
    setProjectDisaggGetClick,
  } = useContext(GlobalContext);

  const [localSelectedRP, setLocalSelectedRP] = useState(null);

  const displayInConsole = () => {
    console.log(
      `Im Disaggregation Return Period: ${localSelectedRP} and selected IM ${projectSelectedIM}`
    );

    setProjectSelectedDisagRP(localSelectedRP);
    setProjectDisaggGetClick(uuidv4());
  };

  return (
    <Fragment>
      <div className="form-group form-section-title">
        <span>Disaggregation</span>
      </div>
      <div className="form-group">
        <label
          id="label-disagg-return-period"
          htmlFor="disagg-return-period"
          className="control-label"
        >
          Return Period
        </label>
        <ProjectSelect
          id="project-rp"
          value={localSelectedRP}
          setSelect={setLocalSelectedRP}
          options={projectRPs}
        />
      </div>

      <div className="form-group">
        <button
          id="project-hazard-curve-get-btn"
          type="button"
          className="btn btn-primary"
          disabled={localSelectedRP === null}
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
