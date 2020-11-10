import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "context";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";

import "assets/style/NZS1170Section.css";

const NZS1170Section = () => {
  const {
    nzs1170ComputeClick,
    setNZS1170ComputeClick,
    showNZS1170,
    setShowNZS1170,

    nzs1170Input,
    setNZS1170Input,
    nzs1170SiteClass,
    setNZS1170SiteClass,
    soilClass,
    nzCodeDefaultParams,
  } = useContext(GlobalContext);
  // TODO - See whether this can be an another one-liner as we are not dealing with this at this point
  const onChangeComputeNZS1170 = (e) => {
    setNZS1170ComputeClick(nzs1170ComputeClick === "true" ? "false" : "true");
  };

  const onChangeShowNZS1170 = (e) => {
    setShowNZS1170(showNZS1170 === "true" ? "false" : "true");
  };

  // TODO - See whether this can be an another one-liner as we are not dealing with this at this point
  const onChangeNZS1170Input = (e) => {
    setNZS1170Input(e.target.value);
  };

  const onChangeNZS1170SiteClass = (e) => {
    setNZS1170SiteClass(e.target.value);
  };
  // Z-factor
  const [localZFactor, setLocalZFactor] = useState(0);

  // For options
  const [localSoilClasses, setLocalSoilClasses] = useState([]);

  // For a selected soil class
  const [selectedSoilClass, setSelectedSoilClass] = useState({});

  useEffect(() => {
    const tempArr = [];

    for (const [key, value] of Object.entries(soilClass)) {
      tempArr.push({
        value: key,
        label: `${key} - ${value.replaceAll("_", " ")}`,
      });
    }
    setLocalSoilClasses(tempArr);
  }, [soilClass]);

  useEffect(() => {
    // Creating a default value for react-select
    if (nzCodeDefaultParams !== null) {
      let defaultSoilClass = localSoilClasses.filter((obj) => {
        return obj.value === nzCodeDefaultParams["soil_class"];
      });

      setSelectedSoilClass(defaultSoilClass);

      setLocalZFactor(nzCodeDefaultParams["z_factor"]);
    }
  }, [nzCodeDefaultParams]);

  return (
    <div>
      <div className="form-group form-section-title">
        <span>NZS1170</span>
      </div>

      <div className="form-group">
        <input type="checkbox" onChange={onChangeShowNZS1170} disabled />
        <span className="show-nzs">&nbsp;Show NZS1170.5 hazard</span>
      </div>

      <div className="form-group">
        <div className="d-flex align-items-center">
          <label
            id="label-z-factor"
            htmlFor="z-factor"
            className="control-label"
          >
            Z Factor
          </label>
          <TextField
            id="z-factor"
            className="flex-grow-1"
            type="number"
            value={localZFactor}
            onChange={(e) => setLocalZFactor(e.target.value)}
            variant="outlined"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="d-flex align-items-center">
          <label
            id="label-soil-class"
            htmlFor="soil-class"
            className="control-label"
          >
            Soil Class
          </label>
          <Select
            id="soil-class"
            className="flex-grow-1"
            value={selectedSoilClass}
            onChange={setSelectedSoilClass}
            options={localSoilClasses}
            isDisabled={localSoilClasses.length === 0}
          />
        </div>
      </div>

      <div className="form-group">
        <button
          id="prob-update"
          type="button"
          className="btn btn-primary"
          disabled
        >
          Compute
        </button>
      </div>
    </div>
  );
};

export default NZS1170Section;
