import React from "react";

const HazardCurveMetadata = ({
  projectId,
  projectLocation,
  projectVS30,
  projectSelectedIM,
}) => {
  return (
    <div className="form-group">
      <textarea
        style={{ color: "red", resize: "none" }}
        className="form-control"
        disabled
        rows="5"
        value={`Project ID: ${projectId}\nLocation: ${projectLocation}\nVS30: ${projectVS30}\nIntensity Measure: ${projectSelectedIM}`}
      ></textarea>
    </div>
  );
};

export default HazardCurveMetadata;
