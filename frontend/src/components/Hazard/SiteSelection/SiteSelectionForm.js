import React, { Fragment, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { disableScrollOnNumInput, handleErrors } from "utils/Utils";
import TextField from "@material-ui/core/TextField";

import "assets/style/HazardForms.css";

import EnsembleSelect from "./EnsembleSelect";
import SiteConditions from "./SiteSelectionVS30SiteConditions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiteSelectionForm = () => {
  const { getTokenSilently } = useAuth0();

  const {
    setLocationSetClick,
    setIMs,
    setVS30,
    setDefaultVS30,
    setStation,
    selectedEnsemble,
    setSiteSelectionLat,
    setSiteSelectionLng,
    mapBoxCoordinate,
    setMapBoxCoordinate,
    setSelectedIM,
    setHazardCurveComputeClick,
    setDisaggComputeClick,
    setUHSComputeClick,
    setUHSRateTable,
  } = useContext(GlobalContext);

  const [locationSetButton, setLocationSetButton] = useState({
    text: "Set",
    isFetching: false,
  });
  const [localLat, setLocalLat] = useState(CONSTANTS.DEFAULT_LAT);
  const [localLng, setLocalLng] = useState(CONSTANTS.DEFAULT_LNG);
  /* 
    InputSource is either `input` or `mapbox`
    `input` for input fields
    `mapbox` for MapBox click
  */
  const [inputSource, setInputSource] = useState({
    lat: "input",
    lng: "input",
  });
  const [localSetClick, setLocalSetClick] = useState(null);

  useEffect(() => {
    if (mapBoxCoordinate.input === "MapBox") {
      setInputSource({ lat: "MapBox", lng: "MapBox" });
    } else if (mapBoxCoordinate.input === "input") {
      setInputSource({ lat: "input", lng: "input" });
    }

    setLocalLat(mapBoxCoordinate.lat);
    setLocalLng(mapBoxCoordinate.lng);
  }, [mapBoxCoordinate]);

  disableScrollOnNumInput();

  const validEnsembleLatLng = () => {
    return (
      selectedEnsemble !== "Choose" &&
      selectedEnsemble !== "Loading" &&
      localLat >= -47.4 &&
      localLat <= -34.3 &&
      localLng >= 165 &&
      localLng <= 180
    );
  };

  const onClickLocationSet = () => {
    setLocalSetClick(uuidv4());
    setSiteSelectionLat(localLat);
    setSiteSelectionLng(localLng);

    if (inputSource.lat === "input" || inputSource.lng === "input") {
      setMapBoxCoordinate({
        lat: localLat,
        lng: localLng,
        input: "input",
      });
    } else {
      setMapBoxCoordinate({
        lat: localLat,
        lng: localLng,
        input: "MapBox",
      });
    }

    setLocationSetClick(uuidv4());
  };

  const setttingLocalLat = (e) => {
    setInputSource((prevState) => ({
      ...prevState,
      lat: "input",
    }));
    setLocalLat(e);
  };

  const settingLocalLng = (e) => {
    setInputSource((prevState) => ({
      ...prevState,
      lng: "input",
    }));
    setLocalLng(e);
  };

  /*
    Run this useEffect only once when this page gets rendered
    The time it gets rendered is when users come to seistech.nz/hazard
    For instance, users were at /home and come to /hazard or /dashboard -> /hazard or even
    /hazard -> /home -> /hazard
    So reset those global values to prevent auto-trigger to get a station, Regional image and VS30 image
  */
  useEffect(() => {
    // For Site Selection
    setLocationSetClick(null);
    setVS30("");
    setDefaultVS30("");
    setStation("");
    setLocalLat(CONSTANTS.DEFAULT_LAT);
    setLocalLng(CONSTANTS.DEFAULT_LNG);
    // For Seismic Hazard Tab
    setSelectedIM(null);
    setHazardCurveComputeClick(null);
    setDisaggComputeClick(null);
    setUHSComputeClick(null);
    // Table rows in UHS section
    setUHSRateTable([]);
    // For location button
    setLocationSetButton({
      text: "Set",
      isFetching: false,
    });
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getStation = async () => {
      if (localSetClick !== null) {
        try {
          const token = await getTokenSilently();
          setVS30("");
          setDefaultVS30("");
          setLocationSetButton({
            text: <FontAwesomeIcon icon="spinner" spin />,
            isFetching: true,
          });
          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_STATION +
              `?ensemble_id=${selectedEnsemble}&lon=${localLng}&lat=${localLat}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          )
            .then(handleErrors)
            .then(async (response) => {
              const responseData = await response.json();
              setStation(responseData.station);
              setVS30(responseData.vs30);
              setDefaultVS30(responseData.vs30);
              setLocationSetButton({
                text: "Set",
                isFetching: false,
              });
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                setLocationSetButton({
                  text: "Set",
                  isFetching: false,
                });
              }
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    getStation();

    return () => {
      abortController.abort();
    };
  }, [localSetClick]);

  /*
    Getting IMs
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getIM = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.CORE_API_ROUTE_IMIDS +
            "?ensemble_id=" +
            selectedEnsemble,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: signal,
          }
        )
          .then(handleErrors)
          .then(async (response) => {
            const responseData = await response.json();
            setIMs(responseData["ims"]);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getIM();

    return () => {
      abortController.abort();
    };
  }, [selectedEnsemble]);

  return (
    <Fragment>
      {CONSTANTS.ENV === "DEV" ? (
        <div>
          <div className="form-row form-section-title">
            <span>Ensemble</span>
          </div>
          <div className="custom-form-group">
            <EnsembleSelect />
          </div>
        </div>
      ) : null}

      <div className="form-row form-section-title">Location</div>

      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <div className="d-flex align-items-center">
            <label
              id="label-haz-lat"
              htmlFor="haz-lat"
              className="control-label"
            >
              Latitude
            </label>
            <TextField
              id="haz-lat"
              className="flex-grow-1"
              type="number"
              value={
                inputSource.lat === "input"
                  ? localLat
                  : Number(localLat).toFixed(4)
              }
              onChange={(e) => setttingLocalLat(e.target.value)}
              placeholder="[-47.4, -34.3]"
              error={
                (localLat >= -47.4 && localLat <= -34.3) || localLat === ""
                  ? false
                  : true
              }
              helperText={
                (localLat >= -47.4 && localLat <= -34.3) || localLat === ""
                  ? " "
                  : "Latitude must be within the range of NZ."
              }
              variant="outlined"
            />
          </div>

          <div className="form-group">
            <div className="d-flex align-items-center">
              <label
                id="label-haz-lng"
                htmlFor="haz-lng"
                className="control-label"
              >
                Longitude
              </label>
              <TextField
                id="haz-lng"
                className="flex-grow-1"
                type="number"
                value={
                  inputSource.lng === "input"
                    ? localLng
                    : Number(localLng).toFixed(4)
                }
                onChange={(e) => settingLocalLng(e.target.value)}
                placeholder="[165, 180]"
                error={
                  (localLng >= 165 && localLng <= 180) || localLng === ""
                    ? false
                    : true
                }
                helperText={
                  (localLng >= 165 && localLng <= 180) || localLng === ""
                    ? " "
                    : "Longitude must be within the range of NZ."
                }
                variant="outlined"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <button
            id="site-selection"
            type="button"
            className="btn btn-primary"
            onClick={onClickLocationSet}
            disabled={!validEnsembleLatLng()}
          >
            {locationSetButton.text}
          </button>
        </div>
      </form>

      <div className="form-row form-section-title">Site Conditions</div>

      <SiteConditions />
    </Fragment>
  );
};

export default SiteSelectionForm;
