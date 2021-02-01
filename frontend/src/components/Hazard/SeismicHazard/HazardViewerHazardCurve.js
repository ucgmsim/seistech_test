import React, { useState, useEffect, useContext, Fragment } from "react";
import { Tabs, Tab } from "react-bootstrap";

import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import {
  LoadingSpinner,
  DownloadButton,
  GuideMessage,
  ErrorMessage,
  HoverSwitch,
  HazardEnsemblePlot,
  HazardBranchPlot,
} from "components/common";

import { handleErrors } from "utils/Utils";

import HazardCurveMetadata from "./HazardCurveMetadata";

const HazardViewerHazardCurve = () => {
  const { getTokenSilently } = useAuth0();

  const {
    hazardCurveComputeClick,
    setHazardCurveComputeClick,
    vs30,
    defaultVS30,
    selectedIM,
    selectedEnsemble,
    station,
    hazardNZCodeData,
    setHazardNZCodeData,
    nzCodeDefaultParams,
    selectedSoilClass,
    selectedZFactor,
    showHazardNZCode,
    setIsNZCodeComputed,
    setComputedSoilClass,
    setComputedZFactor,
    siteSelectionLat,
    siteSelectionLng,
    hazardNZCodeToken,
    setHazardNZCodeToken,
  } = useContext(GlobalContext);

  const [showSpinnerHazard, setShowSpinnerHazard] = useState(false);
  const [showPlotHazard, setShowPlotHazard] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [hazardData, setHazardData] = useState(null);

  const [downloadHazardToken, setDownloadHazardToken] = useState("");

  const [toggleState, setToggleState] = useState(true);

  const extraInfo = {
    from: "hazard",
    lat: siteSelectionLat,
    lng: siteSelectionLng,
  };

  /*
    Reset tabs if users change IM or VS30
  */
  useEffect(() => {
    setShowSpinnerHazard(false);
    setShowPlotHazard(false);
    setHazardCurveComputeClick(null);
  }, [selectedIM, vs30]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getHazardCurve = async () => {
      if (hazardCurveComputeClick !== null) {
        try {
          setShowPlotHazard(false);
          setShowSpinnerHazard(true);
          setShowErrorMessage({ isError: false, errorCode: null });
          setIsNZCodeComputed(false);
          setComputedZFactor(selectedZFactor);
          setComputedSoilClass(selectedSoilClass);

          const token = await getTokenSilently();

          let hazardDataQueryString = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}`;
          if (vs30 !== defaultVS30) {
            hazardDataQueryString += `&vs30=${vs30}`;
          }

          fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_HAZARD_PLOT +
              hazardDataQueryString,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          )
            .then(handleErrors)
            .then(async (hazardResponse) => {
              const hazardData = await hazardResponse.json();
              setHazardData(hazardData);
              setDownloadHazardToken(hazardData["download_token"]);

              let nzCodeQueryString = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}&soil_class=${
                selectedSoilClass["value"]
              }&distance=${Number(
                nzCodeDefaultParams["distance"]
              )}&z_factor=${selectedZFactor}`;

              return fetch(
                CONSTANTS.CORE_API_BASE_URL +
                  CONSTANTS.CORE_API_ROUTE_HAZARD_NZCODE +
                  nzCodeQueryString,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  signal: signal,
                }
              );
            })
            .then(handleErrors)
            .then(async (response) => {
              const nzCodeDataResponse = await response.json();
              setHazardNZCodeData(
                nzCodeDataResponse["nz1170p5_hazard"]["im_values"]
              );
              setHazardNZCodeToken(nzCodeDataResponse["download_token"]);
              setIsNZCodeComputed(true);
              setShowSpinnerHazard(false);
              setShowPlotHazard(true);
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                setShowSpinnerHazard(false);
                setShowErrorMessage({ isError: true, errorCode: error });
              }
              console.log(error);
            });
        } catch (error) {
          setShowSpinnerHazard(false);
          setShowErrorMessage({ isError: true, errorCode: error });
          console.log(error);
        }
      }
    };
    getHazardCurve();

    return () => {
      abortController.abort();
    };
  }, [hazardCurveComputeClick]);

  return (
    <div className="hazard-curve-viewer">
      <Tabs defaultActiveKey="ensemble" className="pivot-tabs">
        <Tab eventKey="ensemble" title="Ensemble branches">
          {hazardCurveComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.HAZARD_CURVE}
              body={CONSTANTS.HAZARD_CURVE_WARNING_MSG}
              instruction={CONSTANTS.HAZARD_CURVE_INSTRUCTION}
            />
          )}

          {showSpinnerHazard === true &&
            hazardCurveComputeClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {hazardCurveComputeClick !== null &&
            showSpinnerHazard === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinnerHazard === false &&
            showPlotHazard === true &&
            hazardData !== null &&
            showErrorMessage.isError === false && (
              <Fragment>
                <HazardBranchPlot
                  hazardData={hazardData}
                  im={selectedIM}
                  nzCodeData={hazardNZCodeData}
                  showNZCode={showHazardNZCode}
                  extra={extraInfo}
                  hoverStatus={toggleState}
                />
                <HazardCurveMetadata
                  selectedEnsemble={selectedEnsemble}
                  selectedIM={selectedIM}
                  vs30={vs30}
                />
              </Fragment>
            )}
        </Tab>

        <Tab eventKey="fault" title="Fault/distributed seismicity contribution">
          {hazardCurveComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.HAZARD_CURVE}
              body={CONSTANTS.HAZARD_CURVE_WARNING_MSG}
              instruction={CONSTANTS.HAZARD_CURVE_INSTRUCTION}
            />
          )}

          {showSpinnerHazard === true &&
            hazardCurveComputeClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {hazardCurveComputeClick !== null &&
            showSpinnerHazard === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinnerHazard === false &&
            showPlotHazard === true &&
            hazardData !== null &&
            showErrorMessage.isError === false && (
              <Fragment>
                <HazardEnsemblePlot
                  hazardData={hazardData}
                  im={selectedIM}
                  nzCodeData={hazardNZCodeData}
                  showNZCode={showHazardNZCode}
                  extra={extraInfo}
                  hoverStatus={toggleState}
                />
                <HazardCurveMetadata
                  selectedEnsemble={selectedEnsemble}
                  selectedIM={selectedIM}
                  vs30={vs30}
                />
              </Fragment>
            )}
        </Tab>
      </Tabs>

      <HoverSwitch
        toggleState={toggleState}
        changeToggleState={setToggleState}
        disabledStatus={!showPlotHazard}
      />

      <DownloadButton
        disabled={!showPlotHazard}
        downloadURL={CONSTANTS.CORE_API_DOWNLOAD_HAZARD}
        downloadToken={{
          hazard_token: downloadHazardToken,
          nz1170p5_hazard_token: hazardNZCodeToken,
        }}
        extraParams={{
          ensemble_id: selectedEnsemble,
          station: station,
          im: selectedIM,
          vs30: vs30,
        }}
        fileName={`Hazard_${selectedEnsemble}_${station}_${selectedIM}.zip`}
      />
    </div>
  );
};

export default HazardViewerHazardCurve;
