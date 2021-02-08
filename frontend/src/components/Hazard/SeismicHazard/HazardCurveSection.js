import React, { useState, useContext, useEffect, Fragment } from "react";
import IMSelect from "components/common/IMSelect";
import GuideTooltip from "components/common/GuideTooltip";
import * as CONSTANTS from "constants/Constants";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";

const HazardCurveSection = () => {
  const {
    selectedIM,
    setSelectedIM,
    setHazardCurveComputeClick,
    showHazardNZCode,
    setShowHazardNZCode,
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
        <IMSelect title="Intensity Measure" setIM={setSelectedIM} />
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
          checked={showHazardNZCode}
          onChange={() => setShowHazardNZCode(!showHazardNZCode)}
        />
        <span className="show-nzs">&nbsp;Show NZS1170.5</span>
      </div>
    </Fragment>
  );
};

export default HazardCurveSection;
