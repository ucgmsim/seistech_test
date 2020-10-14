import React, { useState, useContext, useEffect } from "react";
import IMSelect from "components/common/IMSelect";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";

const HazardCurveSection = () => {
  const { selectedIM, setSelectedIM, setHazardCurveComputeClick } = useContext(
    GlobalContext
  );

  const [
    disabledButtonHazardCurveCompute,
    setDisabledButtonHazardCurveCompute,
  ] = useState(true);

  useEffect(() => {
    setDisabledButtonHazardCurveCompute(selectedIM === null);
  }, [selectedIM]);

  return (
    <div>
      <div className="form-group form-section-title">
        <span>Hazard Curve</span>
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
    </div>
  );
};

export default HazardCurveSection;
