import React, { useState, useEffect, useContext, Fragment } from "react";
import { GlobalContext } from "context";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import * as CONSTANTS from "constants/Constants";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import "assets/style/NZS1170Section.css";
import { handleErrors } from "utils/Utils";

const NZS1170Section = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    selectedIM,
    NZCodeData,
    setNZCodeData,
    showNZCodePlots,
    setShowNZCodePlots,
    soilClass,
    nzCodeDefaultParams,
    selectedSoilClass,
    setSelectedSoilClass,
    selectedZFactor,
    setSelectedZFactor,
    setIsNZCodeComputed,
  } = useContext(GlobalContext);

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

  const onClickDefaultZFactor = () => {
    setLocalZFactor(defaultZFactor);
    setSelectedZFactor(defaultZFactor);
  };

  const onClickDefaultSoilClass = () => {
    setLocalSelectedSoilClass(defaultSoilClass);
    setSelectedSoilClass(defaultSoilClass);
  };

  const computeNZCode = async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const token = await getTokenSilently();

    let nzCodeQueryString = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}&soil_class=${
      selectedSoilClass["value"]
    }&distance=${Number(
      nzCodeDefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZCodeComputed(false);

    fetch(
      CONSTANTS.CORE_API_BASE_URL +
        CONSTANTS.CORE_API_ROUTE_HAZARD_NZCODE +
        nzCodeQueryString,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: signal,
      }
    )
      .then(handleErrors)
      .then(async (response) => {
        const nzCodeDataResponse = await response.json();
        setNZCodeData(nzCodeDataResponse["im_values"]);
        setIsNZCodeComputed(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const computeNZCodeValidate = () => {
    return (
      selectedSoilClass === defaultSoilClass ||
      selectedZFactor === defaultZFactor
    );
  };

  return (
    <Fragment>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group form-section-title">
          <span>NZS1170</span>
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            checked={showNZCodePlots}
            onChange={() => {
              setShowNZCodePlots(!showNZCodePlots);
              console.log("THIS IS NZCODE DATA: ", NZCodeData);
            }}
          />
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

        <div className="form-row">
          <button
            id="compute-nz-code"
            type="button"
            className="btn btn-primary"
            onClick={() => computeNZCode()}
          >
            Compute
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default NZS1170Section;
