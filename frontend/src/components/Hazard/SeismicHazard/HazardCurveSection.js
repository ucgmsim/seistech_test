import React, { useState, useContext, useEffect, Fragment } from "react";

import { v4 as uuidv4 } from "uuid";

import * as CONSTANTS from "constants/Constants";
import { GlobalContext } from "context";

import { IMSelect, GuideTooltip } from "components/common";

const HazardCurveSection = () => {
  const {
    IMs,
    selectedIM,
    setSelectedIM,
    setHazardCurveComputeClick,
    showHazardNZS1170p5,
    setShowHazardNZS1170p5,
  } = useContext(GlobalContext);

  const [
    disabledButtonHazardCurveCompute,
    setDisabledButtonHazardCurveCompute,
  ] = useState(true);

  useEffect(() => {
    setDisabledButtonHazardCurveCompute(selectedIM === null);
  }, [selectedIM]);

  return (
    <Fragment>
      <div className="form-group form-section-title">
        Hazard Curve
        <GuideTooltip
          explanation={CONSTANTS.TOOLTIP_MESSAGES["HAZARD_HAZARD"]}
        />
      </div>
      <div className="custom-form-group">
        <IMSelect
          title="Intensity Measure"
          setIM={setSelectedIM}
          options={IMs}
        />
      </div>

      <div className="form-group">
        <button
          id="im-select"
          type="button"
          className="btn btn-primary"
          disabled={disabledButtonHazardCurveCompute}
          onClick={() => {
            setHazardCurveComputeClick(uuidv4());
          }}
        >
          Compute
        </button>
      </div>
      <div className="form-group">
        <input
          type="checkbox"
          checked={showHazardNZS1170p5}
          onChange={() => setShowHazardNZS1170p5(!showHazardNZS1170p5)}
        />
        <span className="show-nzs">&nbsp;Show NZS1170.5</span>
      </div>
    </Fragment>
  );
};

export default HazardCurveSection;
