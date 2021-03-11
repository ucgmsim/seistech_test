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
import { handleErrors } from "utils/Utils";
import { HazardCurveMetadata } from "components/Project/SeismicHazard";

const HazardViewerHazardCurve = () => {
  const { getTokenSilently } = useAuth0();

  const {
    projectHazardCurveGetClick,
    setProjectHazardCurveGetClick,
    projectId,
    projectLocation,
    projectVS30,
    projectLocationCode,
    projectLat,
    projectLng,
    projectSelectedIM,
    setProjectSelectedIM,
  } = useContext(GlobalContext);

  const [showSpinnerHazard, setShowSpinnerHazard] = useState(false);
  const [showPlotHazard, setShowPlotHazard] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [hazardData, setHazardData] = useState(null);

  // NZS1170P5 code is now splitted
  const [hazardNZS1170p5Data, setHazardNZS1170p5Data] = useState(null);

  const [downloadToken, setDownloadToken] = useState("");

  const extraInfo = {
    from: "project",
    id: projectId,
    location: projectLocation,
    vs30: projectVS30,
    im: projectSelectedIM,
  };

  /*
    Reset tabs if users change Project ID, Vs30 or Location
  */
  useEffect(() => {
    setShowSpinnerHazard(false);
    setShowPlotHazard(false);
    setProjectHazardCurveGetClick(null);
    setProjectSelectedIM(null);
  }, [projectId, projectVS30, projectLocation]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getHazardCurve = async () => {
      if (projectHazardCurveGetClick !== null) {
        try {
          setShowPlotHazard(false);
          setShowSpinnerHazard(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          const token = await getTokenSilently();

          let queryString = `?project_id=${projectId}&station_id=${projectLocationCode[projectLocation]}_${projectVS30}&im=${projectSelectedIM}`;

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.PROJECT_API_HAZARD_ENDPOINT +
              queryString,
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
              setHazardData(responseData);
              setHazardNZS1170p5Data(responseData["nz_code_hazard"].im_values);
              setDownloadToken(responseData["download_token"]);
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
  }, [projectHazardCurveGetClick]);

  return (
    <div className="hazard-curve-viewer">
      <Tabs defaultActiveKey="ensemble" className="pivot-tabs">
        <Tab eventKey="ensemble" title="Ensemble branches">
          {projectHazardCurveGetClick === null && (
            <GuideMessage
              header={CONSTANTS.HAZARD_CURVE}
              body={CONSTANTS.HAZARD_CURVE_GUIDE_MSG}
              instruction={CONSTANTS.PROJECT_HAZARD_CURVE_INSTRUCTION}
            />
          )}

          {showSpinnerHazard === true &&
            projectHazardCurveGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectHazardCurveGetClick !== null &&
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
                  im={projectSelectedIM}
                  nzs1170p5Data={hazardNZS1170p5Data}
                  extra={extraInfo}
                />
                <HazardCurveMetadata
                  projectId={projectId}
                  projectLocation={projectLocation}
                  projectVS30={projectVS30}
                  projectSelectedIM={projectSelectedIM}
                  projectLat={projectLat}
                  projectLng={projectLng}
                />
              </Fragment>
            )}
        </Tab>

        <Tab eventKey="fault" title="Fault/distributed seismicity contribution">
          {projectHazardCurveGetClick === null && (
            <GuideMessage
              header={CONSTANTS.HAZARD_CURVE}
              body={CONSTANTS.HAZARD_CURVE_GUIDE_MSG}
              instruction={CONSTANTS.PROJECT_HAZARD_CURVE_INSTRUCTION}
            />
          )}

          {showSpinnerHazard === true &&
            projectHazardCurveGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectHazardCurveGetClick !== null &&
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
                  im={projectSelectedIM}
                  nzs1170p5Data={hazardNZS1170p5Data}
                  extra={extraInfo}
                />
                <HazardCurveMetadata
                  projectId={projectId}
                  projectLocation={projectLocation}
                  projectVS30={projectVS30}
                  projectSelectedIM={projectSelectedIM}
                  projectLat={projectLat}
                  projectLng={projectLng}
                />
              </Fragment>
            )}
        </Tab>
      </Tabs>

      <DownloadButton
        disabled={!showPlotHazard}
        downloadURL={CONSTANTS.PROJECT_API_HAZARD_CURVE_DOWNLOAD_ENDPOINT}
        downloadToken={{
          hazard_token: downloadToken,
        }}
        extraParams={{
          project_id: projectId,
          station_id: `${projectLocationCode[projectLocation]}_${projectVS30}`,
          im: projectSelectedIM,
        }}
        fileName="hazard.zip"
      />
    </div>
  );
};

export default HazardViewerHazardCurve;
