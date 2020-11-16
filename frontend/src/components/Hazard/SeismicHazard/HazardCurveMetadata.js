import React, { useState, useEffect, useContext } from "react";

import { GlobalContext } from "context";

const HazardCurveMetadata = ({ selectedEnsemble, selectedIM, vs30 }) => {
  const { selectedZFactor, selectedSoilClass, isNZCodeComputed } = useContext(
    GlobalContext
  );

  const [localZFactor, setLocalZFactor] = useState(1);
  const [localSoilClass, setLocalSoilClass] = useState(1);

  useEffect(() => {
    if (isNZCodeComputed === true) {
      setLocalZFactor(selectedZFactor);
      setLocalSoilClass(selectedSoilClass);
    }
  }, [isNZCodeComputed]);

  return (
    <div className="form-group">
      <textarea
        style={{ color: "red", resize: "none" }}
        className="form-control"
        disabled
        rows="5"
        value={`Ensemble: ${selectedEnsemble}\nIntensity Measure: ${selectedIM}\nVS30: ${vs30}\nZ Factor: ${localZFactor}\nSoil Class: ${localSoilClass["label"]}`}
      ></textarea>
    </div>
  );
};

export default HazardCurveMetadata;
