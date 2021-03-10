import React, { useState, useEffect, useContext, Fragment } from "react";

import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import { GuideTooltip } from "components/common";
import { handleErrors } from "utils/Utils";

import "assets/style/NZS1170p5Section.css";

const NZS1170p5Section = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    selectedIM,
    setHazardNZS1170p5Data,
    setUHSNZS1170p5Data,
    soilClass,
    nzs1170p5DefaultParams,
    selectedSoilClass,
    setSelectedSoilClass,
    selectedZFactor,
    setSelectedZFactor,
    setIsNZS1170p5Computed,
    computedSoilClass,
    setComputedSoilClass,
    computedZFactor,
    setComputedZFactor,
    hazardCurveComputeClick,
    uhsComputeClick,
    uhsRateTable,
    setHazardNZS1170p5Token,
    setUHSNZS1170p5Token,
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
    if (Object.entries(soilClass).length > 0) {
      // Due to value.replaceAll can't be applied on null, check the object is not empty
      const tempArr = [];

      for (const [key, value] of Object.entries(soilClass)) {
        tempArr.push({
          value: key,
          label: `${key} - ${value.replaceAll("_", " ")}`,
        });
      }
      setLocalSoilClasses(tempArr);
    }
  }, [soilClass]);

  /*
    When app managed to get a default params (Z Factor and Soil Class)
    Convert them into a proper form to be used for react-select
  */
  useEffect(() => {
    // only if nzs1170p5DefaultParams is not an empty array, its default value is []
    if (nzs1170p5DefaultParams.length !== 0) {
      /*
        Out of options we have, find the array that matches with default Soil Class
        E.g., if the default Soil Class is D - soft or deep soil,
        defaultSoilClass will be an object that has a value of D
      */
      let defaultSoilClass = localSoilClasses.filter((obj) => {
        return obj.value === nzs1170p5DefaultParams["soil_class"];
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
        setLocalZFactor(Number(nzs1170p5DefaultParams["z_factor"]));
        setSelectedZFactor(Number(nzs1170p5DefaultParams["z_factor"]));
        setDefaultZFactor(Number(nzs1170p5DefaultParams["z_factor"]));
      }
    }
  }, [nzs1170p5DefaultParams]);

  const onClickDefaultZFactor = () => {
    setLocalZFactor(defaultZFactor);
    setSelectedZFactor(defaultZFactor);
  };

  const onClickDefaultSoilClass = () => {
    setLocalSelectedSoilClass(defaultSoilClass);
    setSelectedSoilClass(defaultSoilClass);
  };

  /*
   API calls that wil be eventually separated
  */
  const computeBothNZCode = async () => {
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
      nzs1170p5DefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    let uhsNZCodeQuery = `?ensemble_id=${selectedEnsemble}&station=${station}&exceedances=${exceedances.join(
      ","
    )}&soil_class=${selectedSoilClass["value"]}&distance=${Number(
      nzs1170p5DefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZS1170p5Computed(false);

    await Promise.all([
      fetch(
        CONSTANTS.CORE_API_BASE_URL +
          CONSTANTS.CORE_API_HAZARD_NZS1170P5_ENDPOINT +
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
          CONSTANTS.CORE_API_HAZARD_UHS_NZS1170P5_ENDPOINT +
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
        const hazardNZS1170p5Data = await hazard.json();
        const uhsNZS1170p5Data = await uhs.json();
        setHazardNZS1170p5Data(hazardNZS1170p5Data["nz1170p5_hazard"]["im_values"]);
        setUHSNZS1170p5Data(uhsNZS1170p5Data["nz_code_uhs_df"]);

        setHazardNZS1170p5Token(hazardNZS1170p5Data["download_token"]);
        setUHSNZS1170p5Token(uhsNZS1170p5Data["download_token"]);

        setIsNZS1170p5Computed(true);
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
      nzs1170p5DefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZS1170p5Computed(false);

    await fetch(
      CONSTANTS.CORE_API_BASE_URL +
        CONSTANTS.CORE_API_HAZARD_NZS1170P5_ENDPOINT +
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
        const hazardNZS1170p5Data = await response.json();
        setHazardNZS1170p5Data(hazardNZS1170p5Data["nz1170p5_hazard"]["im_values"]);

        setHazardNZS1170p5Token(hazardNZS1170p5Data["download_token"]);

        setIsNZS1170p5Computed(true);
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
      nzs1170p5DefaultParams["distance"]
    )}&z_factor=${selectedZFactor}`;

    setIsNZS1170p5Computed(false);

    await fetch(
      CONSTANTS.CORE_API_BASE_URL +
        CONSTANTS.CORE_API_HAZARD_UHS_NZS1170P5_ENDPOINT +
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
        const uhsNZS1170p5Data = await response.json();
        setUHSNZS1170p5Data(uhsNZS1170p5Data["nz_code_uhs_df"]);

        setUHSNZS1170p5Token(uhsNZS1170p5Data["download_token"]);

        setIsNZS1170p5Computed(true);
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

  /*
    When NZS1170P5 code's Compute gets clicked
    Depends on the situation, it has three different scenarios
    1. Only Hazard Curve is valid, call Hazard Curve's NZCode to update its NZS1170P5 code data
    2. Only UHS is valid, call UHSs NZCode to update its NZS1170P5 code data
    3. Both Hazad Curve and UHS are valid, call both API to update their NZS1170P5 code data.
  */

  const computeNZCode = () => {
    if (hazardCurveComputeClick === null && uhsComputeClick !== null) {
      computeUHSNZCode();
    } else if (uhsComputeClick === null && hazardCurveComputeClick !== null) {
      computeHazardNZCode();
    } else if (uhsComputeClick !== null && hazardCurveComputeClick !== null) {
      computeBothNZCode();
    }
  };

  /*
    Compute button is disabled when users haven't computed UHS nor Hazard Curve.
    After either of both get computed, until they update Soil Class and/or Z Factor, it stays disabled.
    It only gets enabled when at least one data is there (compare with computeClick is not null for Hazard Curve and UHS)
    and Z factor and/or Soil Class get changed.
  */
  const computeBtnValidator = () => {
    return (
      (selectedSoilClass !== computedSoilClass ||
        selectedZFactor !== computedZFactor) &&
      (hazardCurveComputeClick !== null || uhsComputeClick !== null)
    );
  };

  return (
    <Fragment>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group form-section-title">
          NZS1170.5
          <GuideTooltip
            explanation={CONSTANTS.TOOLTIP_MESSAGES["HAZARD_NZCODE"]}
            hyperlink={CONSTANTS.TOOLTIP_URL["HAZARD_NZCODE"]}
          />
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
            disabled={!computeBtnValidator()}
            onClick={() => computeNZCode()}
          >
            {computeButton.text}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default NZS1170p5Section;
