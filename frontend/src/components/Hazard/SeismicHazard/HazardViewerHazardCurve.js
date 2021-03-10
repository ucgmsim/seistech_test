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
  HazardEnsemblePlot,
  HazardBranchPlot,
} from "components/common";
import { HazardCurveMetadata } from "components/Hazard/SeismicHazard";
import { handleErrors } from "utils/Utils";

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
    hazardNZS1170p5Data,
    setHazardNZS1170p5Data,
    nzs1170p5DefaultParams,
    selectedSoilClass,
    selectedZFactor,
    showHazardNZS1170p5,
    setIsNZS1170p5Computed,
    setComputedSoilClass,
    setComputedZFactor,
    siteSelectionLat,
    siteSelectionLng,
    hazardNZS1170p5Token,
    setHazardNZS1170p5Token,
  } = useContext(GlobalContext);

  const [showSpinnerHazard, setShowSpinnerHazard] = useState(false);
  const [showPlotHazard, setShowPlotHazard] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [hazardData, setHazardData] = useState(null);

  const [downloadHazardToken, setDownloadHazardToken] = useState("");

  const extraInfo = {
    from: "hazard",
    lat: siteSelectionLat,
    lng: siteSelectionLng,
  };

  /*
    Reset tabs if users change IM or Vs30
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
          setIsNZS1170p5Computed(false);
          setComputedZFactor(selectedZFactor);
          setComputedSoilClass(selectedSoilClass);

          const token = await getTokenSilently();

          let hazardDataQueryString = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}`;
          if (vs30 !== defaultVS30) {
            hazardDataQueryString += `&vs30=${vs30}`;
          }

          fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_HAZARD_ENDPOINT +
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

              let nzs1170p5CodeQueryString = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}&soil_class=${
                selectedSoilClass["value"]
              }&distance=${Number(
                nzs1170p5DefaultParams["distance"]
              )}&z_factor=${selectedZFactor}`;

              return fetch(
                CONSTANTS.CORE_API_BASE_URL +
                  CONSTANTS.CORE_API_HAZARD_NZS1170P5_ENDPOINT +
                  nzs1170p5CodeQueryString,
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
              const nzs1170p5CodeDataResponse = await response.json();
              setHazardNZS1170p5Data(
                nzs1170p5CodeDataResponse["nz1170p5_hazard"]["im_values"]
              );
              setHazardNZS1170p5Token(nzs1170p5CodeDataResponse["download_token"]);
              setIsNZS1170p5Computed(true);
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
              body={CONSTANTS.HAZARD_CURVE_GUIDE_MSG}
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
                  nzs1170p5Data={hazardNZS1170p5Data}
                  showNZS1170p5={showHazardNZS1170p5}
                  extra={extraInfo}
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
              body={CONSTANTS.HAZARD_CURVE_GUIDE_MSG}
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
                  nzs1170p5Data={hazardNZS1170p5Data}
                  showNZS1170p5={showHazardNZS1170p5}
                  extra={extraInfo}
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

      <DownloadButton
        disabled={!showPlotHazard}
        downloadURL={CONSTANTS.CORE_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT}
        downloadToken={{
          hazard_token: downloadHazardToken,
          nz1170p5_hazard_token: hazardNZS1170p5Token,
        }}
        extraParams={{
          ensemble_id: selectedEnsemble,
          station: station,
          im: selectedIM,
          vs30: vs30,
        }}
        fileName="hazard.zip"
      />
    </div>
  );
};

export default HazardViewerHazardCurve;
