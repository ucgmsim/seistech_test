import React from "react";

const HazardCurveMetadata = ({
  projectId,
  projectLocation,
  projectVS30,
  projectSelectedIM,
  projectLat,
  projectLng,
}) => {
  return (
    <div className="form-group">
      <textarea
        style={{ color: "red", resize: "none" }}
        className="form-control"
        disabled
        rows="7"
        value={`Project ID: ${projectId}\nLocation: ${projectLocation}\nLatitude: ${projectLat}\nLongitude: ${projectLng}\nVs30: ${projectVS30}\nIntensity Measure: ${projectSelectedIM}`}
      ></textarea>
    </div>
  );
};

export default HazardCurveMetadata;
