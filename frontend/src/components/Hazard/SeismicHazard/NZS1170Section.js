import React, { useState, useEffect, useContext, Fragment } from "react";
import { GlobalContext } from "context";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import * as CONSTANTS from "constants/Constants";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import "assets/style/NZS1170Section.css";
import { handleErrors } from "utils/Utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NZS1170Section = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    selectedIM,
    setHazardNZCodeData,
    setUHSNZCodeData,
    showNZCodePlots,
    setShowNZCodePlots,
    soilClass,
    nzCodeDefaultParams,
    selectedSoilClass,
    setSelectedSoilClass,
    selectedZFactor,
    setSelectedZFactor,
    setIsNZCodeComputed,
    computedSoilClass,
    setComputedSoilClass,
    computedZFactor,
    setComputedZFactor,
    hazardCurveComputeClick,
    uhsRateTable,
    setHazardNZCodeToken,
    setUHSNZCodeToken,
  } = useContext(GlobalContext);

  const [computeButton, setComputeButton] = useState({
    text: "Compute",
    isFetching: false,
  });

  // Z-factor
  const [localZFactor, setLocalZFactor] = useState(-1);
  const [defaultZFactor, setDefaultZFactor] = useState(-1);

  // For options
  const [localSoilClasses, setLocalSoilClasses] = useState([]);
  const [localSelectedSoilClass, setLocalSelectedSoilClass] = useState({});

  const [defaultSoilClass, setDefaultSoilClass] = useState({});

  /*
    After users set the location from the Site Selection tab,
    App would get list of soil class options
    Based on them, create an array to be used in react-select.
  */
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

  /*
    When app managed to get a default params (Z Factor and Soil Class)
    Convert them into a proper form to be used for react-select
  */
  useEffect(() => {
    // only if nzCodeDefaultParams is not an empty array, its default value is []
    if (nzCodeDefaultParams.length !== 0) {
      /*
        Out of options we have, find the array that matches with default Soil Class
        E.g., if the default Soil Class is D - soft or deep soil,
        defaultSoilClass will be an object that has a value of D
      */
      let defaultSoilClass = localSoilClasses.filter((obj) => {
        return obj.value === nzCodeDefaultParams["soil_class"];
      });

      // Set the default soil class to 1. Global, 2. Default, 3. Local - where gets displayed
      setSelectedSoilClass(defaultSoilClass[0]);
      setDefaultSoilClass(defaultSoilClass[0]);
      setLocalSelectedSoilClass(defaultSoilClass[0]);

      /*
        Based on feedback, Z Factor will never be a negative number, and using this magic number to set default value.
        This was the only way I could find to avoid a warning about having uncrontrolled & controlled form at the same time.
        (React doesn't recommend having a form with controlled and uncontrolled at the same time.)
      */
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

  const computeBothNZCode = async () => {
    console.log("UPDATING BOTH");
    const abortController = new AbortController();
    const signal = abortController.signal;

    const token = await getTokenSilently();

    const exceedances = uhsRateTable.map((entry, idx) => {
      return parseFloat(entry) > 0 ? parseFloat(entry) : 1 / parseFloat(entry);
    });

    setComputeButton({
      text: <FontAwesomeIcon icon="spinner" spin />,
      isFetching: true,
    });

    // To be used to compare with local Z Factor and Soil class to validate Compute Button.
    setComputedZFactor(selectedZFactor);
    setComputedSoilClass(selectedSoilClass);

    let hazardNZCodeQuery = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}&soil_class=${
      selectedSoilClass["value"]
    }&distance=${Number(
      nzCodeDefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    let uhsNZCodeQuery = `?ensemble_id=${selectedEnsemble}&station=${station}&exceedances=${exceedances.join(
      ","
    )}&soil_class=${selectedSoilClass["value"]}&distance=${Number(
      nzCodeDefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZCodeComputed(false);

    await Promise.all([
      fetch(
        CONSTANTS.CORE_API_BASE_URL +
          CONSTANTS.CORE_API_ROUTE_HAZARD_NZCODE +
          hazardNZCodeQuery,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: signal,
        }
      ),
      fetch(
        CONSTANTS.CORE_API_BASE_URL +
          CONSTANTS.CORE_API_ROUTE_UHS_NZCODE +
          uhsNZCodeQuery,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: signal,
        }
      ),
    ])
      .then(handleErrors)
      .then(async ([hazard, uhs]) => {
        const hazardNZCodeData = await hazard.json();
        const uhsNZCodeData = await uhs.json();
        setHazardNZCodeData(hazardNZCodeData["nz11750_hazard"]["im_values"]);
        setUHSNZCodeData(uhsNZCodeData["nz_code_uhs_df"]);

        setHazardNZCodeToken(hazardNZCodeData["download_token"]);
        setUHSNZCodeToken(uhsNZCodeData["download_token"]);

        setIsNZCodeComputed(true);
        setComputeButton({
          text: "Compute",
          isFetching: false,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setComputeButton({
            text: "Compute",
            isFetching: false,
          });
        }
        console.log(error);
      });
  };

  const computeHazardNZCode = async () => {
    console.log("UPDATE HAZARD ONLY");
    const abortController = new AbortController();
    const signal = abortController.signal;

    const token = await getTokenSilently();

    setComputeButton({
      text: <FontAwesomeIcon icon="spinner" spin />,
      isFetching: true,
    });

    // To be used to compare with local Z Factor and Soil class to validate Compute Button.
    setComputedZFactor(selectedZFactor);
    setComputedSoilClass(selectedSoilClass);

    let hazardNZCodeQuery = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}&soil_class=${
      selectedSoilClass["value"]
    }&distance=${Number(
      nzCodeDefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZCodeComputed(false);

    await fetch(
      CONSTANTS.CORE_API_BASE_URL +
        CONSTANTS.CORE_API_ROUTE_HAZARD_NZCODE +
        hazardNZCodeQuery,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: signal,
      }
    )
      .then(handleErrors)
      .then(async (response) => {
        const hazardNZCodeData = await response.json();
        setHazardNZCodeData(hazardNZCodeData["nz11750_hazard"]["im_values"]);

        setHazardNZCodeToken(hazardNZCodeData["download_token"]);

        setIsNZCodeComputed(true);
        setComputeButton({
          text: "Compute",
          isFetching: false,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setComputeButton({
            text: "Compute",
            isFetching: false,
          });
        }
        console.log(error);
      });
  };

  const computeUHSNZCode = async () => {
    console.log("UPDATE UHS ONLY");
    const abortController = new AbortController();
    const signal = abortController.signal;

    const token = await getTokenSilently();

    setComputeButton({
      text: <FontAwesomeIcon icon="spinner" spin />,
      isFetching: true,
    });

    // To be used to compare with local Z Factor and Soil class to validate Compute Button.
    setComputedZFactor(selectedZFactor);
    setComputedSoilClass(selectedSoilClass);

    const exceedances = uhsRateTable.map((entry, idx) => {
      return parseFloat(entry) > 0 ? parseFloat(entry) : 1 / parseFloat(entry);
    });

    let uhsNZCodeQuery = `?ensemble_id=${selectedEnsemble}&station=${station}&exceedances=${exceedances.join(
      ","
    )}&soil_class=${selectedSoilClass["value"]}&distance=${Number(
      nzCodeDefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZCodeComputed(false);

    await fetch(
      CONSTANTS.CORE_API_BASE_URL +
        CONSTANTS.CORE_API_ROUTE_UHS_NZCODE +
        uhsNZCodeQuery,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: signal,
      }
    )
      .then(handleErrors)
      .then(async (response) => {
        const uhsNZCodeData = await response.json();
        setUHSNZCodeData(uhsNZCodeData["nz_code_uhs_df"]);

        setUHSNZCodeToken(uhsNZCodeData["download_token"]);

        setIsNZCodeComputed(true);
        setComputeButton({
          text: "Compute",
          isFetching: false,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setComputeButton({
            text: "Compute",
            isFetching: false,
          });
        }
        console.log(error);
      });
  };

  const computeNZCode = () => {
    if (hazardCurveComputeClick === null) {
      computeUHSNZCode();
    } else if (uhsRateTable.length === 0) {
      computeHazardNZCode();
    } else {
      computeBothNZCode();
    }
  };
  const computeNZCodeValidate = () => {
    return (
      selectedSoilClass !== computedSoilClass ||
      selectedZFactor !== computedZFactor
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
            onChange={() => setShowNZCodePlots(!showNZCodePlots)}
          />
          <span className="show-nzs">&nbsp;Show NZS1170.5 hazard</span>
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

        <div className="form-row">
          <button
            id="compute-nz-code"
            type="button"
            className="btn btn-primary"
            disabled={!computeNZCodeValidate()}
            onClick={() => computeNZCode()}
          >
            {computeButton.text}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default NZS1170Section;
