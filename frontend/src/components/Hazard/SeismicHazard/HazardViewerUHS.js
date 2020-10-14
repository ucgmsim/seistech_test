import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { GlobalContext } from "context";

import { Fragment } from "react";
import UHSPlot from "./UHSPlot";
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
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [downloadToken, setDownloadToken] = useState("");

  const {
    uhsComputeClick,
    vs30,
    defaultVS30,
    selectedEnsemble,
    station,
    uhsRateTable,
  } = useContext(GlobalContext);

  /*
    Reset tabs if users change IM or VS30
  */

  useEffect(() => {
    setShowPlotUHS(false);
    setShowSpinnerUHS(false);
  }, [vs30]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadUHSData = async () => {
      if (uhsComputeClick !== null) {
        try {
          setShowPlotUHS(false);
          setShowSpinnerUHS(true);
          setShowErrorMessage(false);
          const token = await getTokenSilently();

          const exceedences = uhsRateTable.map((entry, idx) => {
            return parseFloat(entry) > 0
              ? parseFloat(entry)
              : 1 / parseFloat(entry);
          });

          let queryString = `?ensemble_id=${selectedEnsemble}&station=${station}&exceedances=${exceedences.join(
            ","
          )}`;

          if (vs30 !== defaultVS30) {
            queryString += `&vs30=${vs30}`;
          }

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_UHS +
              queryString,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          )
            .then(handleErrors)
            .then(async function (response) {
              const responseData = await response.json();
              setUHSData(responseData);
              setDownloadToken(responseData["download_token"]);
              setShowSpinnerUHS(false);
              setShowPlotUHS(true);
            })
            .catch(function (error) {
              setShowSpinnerUHS(false);
              setShowErrorMessage(true);
              console.log(error);
            });
        } catch (error) {
          setShowSpinnerUHS(false);
          setShowErrorMessage(true);
          console.log(error);
        }
      }
    };

    loadUHSData();

    return () => {
      abortController.abort();
    };
  }, [uhsComputeClick]);

  return (
    <div className="uhs-viewer">
      <div className="tab-content">
        {uhsComputeClick === null && (
          <GuideMessage
            header={CONSTANTS.UNIFORM_HAZARD_SPECTRUM}
            body={CONSTANTS.UNIFORM_HAZARD_SPECTRUM_MSG}
            instruction={CONSTANTS.UNIFORM_HAZARD_SPECTRUM_INSTRUCTION}
          />
        )}

        {showSpinnerUHS === true && uhsComputeClick !== null && (
          <LoadingSpinner />
        )}

        {uhsComputeClick !== null &&
          showSpinnerUHS === false &&
          showErrorMessage === true && <ErrorMessage />}

        {showSpinnerUHS === false && showPlotUHS === true && (
          <Fragment>
            <UHSPlot uhsData={uhsData} />
          </Fragment>
        )}
      </div>

      <DownloadButton
        disabled={!showPlotUHS}
        downloadURL={CONSTANTS.INTE_API_DOWNLOAD_UHS}
        downloadToken={downloadToken}
        fileName="uniform_hazard_spectrum.zip"
      />
    </div>
  );
};

export default HazardViewerUhs;
