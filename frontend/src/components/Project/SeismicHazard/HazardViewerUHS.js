import React, { Fragment, useEffect, useState, useContext } from "react";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { GlobalContext } from "context";

import UHSPlot from "../../common/UHS/UHSPlot";
import LoadingSpinner from "components/common/LoadingSpinner";
import DownloadButton from "components/common/DownloadButton";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";
import { handleErrors } from "utils/Utils";

const HazardViewerUhs = () => {
  const { getTokenSilently } = useAuth0();

  const [uhsData, setUHSData] = useState(null);

  const [showSpinnerUHS, setShowSpinnerUHS] = useState(false);
  const [showPlotUHS, setShowPlotUHS] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [downloadToken, setDownloadToken] = useState("");

  const {
    projectId,
    projectLocation,
    projectVS30,
    projectLocationCode,
    projectSelectedUHSRP,
    projectUHSGetClick,
  } = useContext(GlobalContext);

  /*
    Reset tabs if users change IM or VS30
  */

  // useEffect(() => {
  //   setShowPlotUHS(false);
  //   setShowSpinnerUHS(false);
  // }, [vs30]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    console.log(projectSelectedUHSRP);
    const loadUHSData = async () => {
      if (projectUHSGetClick !== null) {
        try {
          setShowPlotUHS(false);
          setShowSpinnerUHS(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          const token = await getTokenSilently();

          let tempArray = [];

          projectSelectedUHSRP.forEach((RP) => tempArray.push(RP.value));

          let queryString = `?project_id=${projectId}&station_id=${
            projectLocationCode[projectLocation]
          }_${projectVS30}&rp=${tempArray.join(",")}`;

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_PORJECT_UHS_GET +
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
              setUHSData(responseData);
              // setDownloadToken(responseData["download_token"]);
              setShowSpinnerUHS(false);
              setShowPlotUHS(true);
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                setShowSpinnerUHS(false);
                setShowErrorMessage({ isError: true, errorCode: error });
              }
              console.log(error);
            });
        } catch (error) {
          setShowSpinnerUHS(false);
          setShowErrorMessage({ isError: false, errorCode: error });
        }
      }
    };

    loadUHSData();

    return () => {
      abortController.abort();
    };
  }, [projectUHSGetClick]);

  return (
    <div className="uhs-viewer">
      <div className="tab-content">
        {projectUHSGetClick === null && (
          <GuideMessage
            header={CONSTANTS.UNIFORM_HAZARD_SPECTRUM}
            body={CONSTANTS.UNIFORM_HAZARD_SPECTRUM_MSG}
            instruction={CONSTANTS.UNIFORM_HAZARD_SPECTRUM_INSTRUCTION}
          />
        )}

        {showSpinnerUHS === true &&
          projectUHSGetClick !== null &&
          showErrorMessage.isError === false && <LoadingSpinner />}

        {projectUHSGetClick !== null &&
          showSpinnerUHS === false &&
          showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}

        {showSpinnerUHS === false &&
          showPlotUHS === true &&
          showErrorMessage.isError === false && (
            <Fragment>
              <UHSPlot uhsData={uhsData} />
            </Fragment>
          )}
      </div>

      {/* <DownloadButton
        disabled={!showPlotUHS}
        downloadURL={CONSTANTS.INTE_API_DOWNLOAD_UHS}
        downloadToken={downloadToken}
        fileName="uniform_hazard_spectrum.zip"
      /> */}
    </div>
  );
};

export default HazardViewerUhs;
