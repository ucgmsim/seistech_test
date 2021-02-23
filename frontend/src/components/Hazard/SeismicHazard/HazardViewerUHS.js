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

const HazardViewerUHS = () => {
  const { getTokenSilently } = useAuth0();

  const {
    uhsComputeClick,
    selectedSoilClass,
    nzCodeDefaultParams,
    selectedZFactor,
    vs30,
    defaultVS30,
    selectedEnsemble,
    station,
    uhsRateTable,
    siteSelectionLat,
    siteSelectionLng,
    uhsNZCodeData,
    setUHSNZCodeData,
    uhsNZCodeToken,
    setUHSNZCodeToken,
    showUHSNZCode,
  } = useContext(GlobalContext);

  const [uhsData, setUHSData] = useState(null);

  const [showSpinnerUHS, setShowSpinnerUHS] = useState(false);
  const [showPlotUHS, setShowPlotUHS] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [downloadUHSToken, setDownloadUHSToken] = useState("");

  const [extraParams, setExtraParams] = useState({});

  const extraInfo = {
    from: "hazard",
    lat: siteSelectionLat,
    lng: siteSelectionLng,
  };

  useEffect(() => {
    // By switching the tab between Project <-> Hazarad Analysis, it goes to undefined
    // and we only update extraParams for storing DB only if they are not undefined
    if (selectedSoilClass !== undefined && nzCodeDefaultParams !== undefined) {
      setExtraParams({
        ...extraParams,
        soil_class: `${selectedSoilClass["value"]}`,
        distance: Number(nzCodeDefaultParams["distance"]),
      });
    }
  }, [selectedSoilClass, nzCodeDefaultParams]);

  /*
    Reset tabs if users change IM or Vs30
  */
  useEffect(() => {
    setShowPlotUHS(false);
    setShowSpinnerUHS(false);
  }, [vs30]);

  const getExceedances = () => {
    const exceedances = uhsRateTable.map((entry, idx) => {
      return parseFloat(entry) > 0 ? parseFloat(entry) : 1 / parseFloat(entry);
    });

    return exceedances;
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadUHSData = async () => {
      if (uhsComputeClick !== null) {
        try {
          setShowPlotUHS(false);
          setShowSpinnerUHS(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          setExtraParams({
            ...extraParams,
            ensemble_id: selectedEnsemble,
            station: station,
            exceedances: getExceedances().join(","),
            z_factor: selectedZFactor,
          });

          const token = await getTokenSilently();

          let queryString = `?ensemble_id=${selectedEnsemble}&station=${station}&exceedances=${getExceedances().join(
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
            .then(async (uhsResponse) => {
              const responseData = await uhsResponse.json();
              setUHSData(responseData["uhs_df"]);
              setDownloadUHSToken(responseData["download_token"]);

              let nzCodeQueryString = `?ensemble_id=${selectedEnsemble}&station=${station}&exceedances=${getExceedances().join(
                ","
              )}&soil_class=${selectedSoilClass["value"]}&distance=${Number(
                nzCodeDefaultParams["distance"]
              )}&z_factor=${selectedZFactor}`;

              return fetch(
                CONSTANTS.CORE_API_BASE_URL +
                  CONSTANTS.CORE_API_ROUTE_UHS_NZCODE +
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
            .then(async (nzCodeResponse) => {
              const nzCodeDataResponse = await nzCodeResponse.json();
              setUHSNZCodeData(nzCodeDataResponse["nz_code_uhs_df"]);
              setUHSNZCodeToken(nzCodeDataResponse["download_token"]);
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

        {showSpinnerUHS === true &&
          uhsComputeClick !== null &&
          showErrorMessage.isError === false && <LoadingSpinner />}

        {uhsComputeClick !== null &&
          showSpinnerUHS === false &&
          showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}

        {showSpinnerUHS === false &&
          showPlotUHS === true &&
          showErrorMessage.isError === false && (
            <Fragment>
              <UHSPlot
                uhsData={uhsData}
                nzCodeData={uhsNZCodeData}
                showNZCode={showUHSNZCode}
                extra={extraInfo}
              />
            </Fragment>
          )}
      </div>

      <DownloadButton
        disabled={!showPlotUHS}
        downloadURL={CONSTANTS.CORE_API_DOWNLOAD_UHS}
        downloadToken={{
          uhs_token: downloadUHSToken,
          nz1170p5_hazard_token: uhsNZCodeToken,
        }}
        extraParams={extraParams}
        fileName="uniform_hazard_spectrum.zip"
      />
    </div>
  );
};

export default HazardViewerUHS;
