import React, { useState, useEffect, useContext, Fragment } from "react";
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
    selectedSoilClass,
    setSelectedSoilClass,
    selectedZFactor,
    setSelectedZFactor,
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
  const [localZFactor, setLocalZFactor] = useState(-1);
  const [defaultZFactor, setDefaultZFactor] = useState(-1);

  // For options
  const [localSoilClasses, setLocalSoilClasses] = useState([]);
  const [localSelectedSoilClass, setLocalSelectedSoilClass] = useState({});

  const [defaultSoilClass, setDefaultSoilClass] = useState({});

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
    if (nzCodeDefaultParams.length !== 0) {
      let defaultSoilClass = localSoilClasses.filter((obj) => {
        return obj.value === nzCodeDefaultParams["soil_class"];
      });

      setSelectedSoilClass(defaultSoilClass[0]);
      setDefaultSoilClass(defaultSoilClass[0]);
      setLocalSelectedSoilClass(defaultSoilClass[0]);

      if (localZFactor === -1) {
        setLocalZFactor(Number(nzCodeDefaultParams["z_factor"]));
        setSelectedZFactor(Number(nzCodeDefaultParams["z_factor"]));
        setDefaultZFactor(Number(nzCodeDefaultParams["z_factor"]));
      }
    }
  }, [nzCodeDefaultParams]);

  const updateSoilClass = () => {
    setSelectedSoilClass(localSelectedSoilClass);
  };

  const onClickDefaultZFactor = () => {
    setLocalZFactor(defaultZFactor);
    setSelectedZFactor(defaultZFactor);
  };

  const onClickDefaultSoilClass = () => {
    setLocalSelectedSoilClass(defaultSoilClass);
    setSelectedSoilClass(defaultSoilClass);
  };

  return (
    <Fragment>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
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
        <div className="form-row">
          <button
            id="set-z-factor"
            type="button"
            className="btn btn-primary"
            disabled={localZFactor === ""}
            onClick={() => setSelectedZFactor(localZFactor)}
          >
            Set Z-factor
          </button>
          <button
            id="vs30useDefault"
            type="button"
            className="btn btn-primary default-button"
            disabled={selectedZFactor === defaultZFactor}
            onClick={() => onClickDefaultZFactor()}
          >
            Use Default
          </button>
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
              value={localSelectedSoilClass}
              onChange={setLocalSelectedSoilClass}
              options={localSoilClasses}
              isDisabled={localSoilClasses.length === 0}
            />
          </div>
        </div>

        <div className="form-row">
          <button
            id="set-soil-class"
            type="button"
            className="btn btn-primary"
            onClick={() => setSelectedSoilClass(localSelectedSoilClass)}
          >
            Set Soil Class
          </button>
          <button
            id="soil-class-default-button"
            type="button"
            className="btn btn-primary default-button"
            disabled={selectedSoilClass === defaultSoilClass}
            onClick={() => onClickDefaultSoilClass()}
          >
            Use Default
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default NZS1170Section;
