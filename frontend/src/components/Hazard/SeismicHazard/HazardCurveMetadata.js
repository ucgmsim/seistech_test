import React from "react";

const HazardCurveMetadata = ({
  selectedEnsemble,
  station,
  selectedIM,
  vs30,
}) => {
  return (
    <div className="form-group">
      <textarea
        style={{ color: "red", resize: "none" }}
        className="form-control"
        disabled
        rows="5"
        value={`Ensemble: ${selectedEnsemble}\nStation: ${station}\nIntensity Measure: ${selectedIM}\nVS30: ${vs30}`}
      ></textarea>
    </div>
  );
};

export default HazardCurveMetadata;
