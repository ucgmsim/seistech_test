import React, { Fragment, useEffect, useState, useContext } from "react";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { GlobalContext } from "context";

import {
  UHSPlot,
  LoadingSpinner,
  DownloadButton,
  GuideMessage,
  ErrorMessage,
  HoverSwitch,
} from "components/common";

import { handleErrors } from "utils/Utils";

const HazardViewerUHS = () => {
  const { getTokenSilently } = useAuth0();

  const {
    projectId,
    projectLocation,
    projectVS30,
    projectLocationCode,
    projectSelectedUHSRP,
    setProjectSelectedUHSRP,
    projectUHSGetClick,
    setProjectUHSGetClick,
  } = useContext(GlobalContext);

  const [uhsData, setUHSData] = useState(null);
  const [uhsNZCodeData, setUHSNZCodeData] = useState(null);

  const [showSpinnerUHS, setShowSpinnerUHS] = useState(false);
  const [showPlotUHS, setShowPlotUHS] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [downloadToken, setDownloadToken] = useState("");

  const [toggleState, setToggleState] = useState(true);

  /*
    Reset tabs if users change project id, project location or project vs30
  */
  useEffect(() => {
    setShowPlotUHS(false);
    setShowSpinnerUHS(false);
    setProjectSelectedUHSRP([]);
    setProjectUHSGetClick(null);
  }, [projectId, projectLocation, projectVS30]);

  const getSelectedRP = () => {
    let tempArray = [];

    projectSelectedUHSRP.forEach((RP) => tempArray.push(RP.value));

    return tempArray;
  };

  const extraInfo = {
    from: "project",
    id: projectId,
    location: projectLocation,
    vs30: projectVS30,
    selectedRPs: getSelectedRP(),
  };

  /* 
    Filtering the UHSData based on the selected RPs
    First of all, we are going to loop through the object.
    Then check the key of the object is in the selected RP list (E.g., 72, 475, 2475)
    If it eixts, we create another object with the key that are in he selectedRP list and the value is from UHSData

    Simply, if UHSData object is like {A: {...}, B: {...}, C: {...}} and selectedRP is [A, C] 
    Then we create a new object that will have a key of A and C only, => {A: {...}, C: {...}} as users only chose A and C so no need to display/plot for B.
  */
  const filterUHSData = (UHSData, selectedRP) => {
    const filtered = Object.keys(UHSData)
      .filter((key) => selectedRP.includes(1 / Number(key)))
      .reduce((obj, key) => {
        obj[key] = UHSData[key];
        return obj;
      }, {});

    return filtered;
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadUHSData = async () => {
      if (projectUHSGetClick !== null) {
        try {
          setShowPlotUHS(false);
          setShowSpinnerUHS(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          const token = await getTokenSilently();

          let queryString = `?project_id=${projectId}&station_id=${
            projectLocationCode[projectLocation]
          }_${projectVS30}&rp=${getSelectedRP().join(",")}`;

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.PROJECT_API_ROUTE_PROJECT_UHS_GET +
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
              setUHSData(
                filterUHSData(responseData["uhs_df"], getSelectedRP())
              );
              setUHSNZCodeData(
                filterUHSData(responseData["nz_code_uhs_df"], getSelectedRP())
              );
              setDownloadToken(responseData["download_token"]);
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
              <UHSPlot
                uhsData={uhsData}
                nzCodeData={uhsNZCodeData}
                extra={extraInfo}
                hoverStatus={toggleState}
              />
            </Fragment>
          )}
      </div>

      <HoverSwitch
        toggleState={toggleState}
        changeToggleState={setToggleState}
        disabledStatus={!showPlotUHS}
      />

      <DownloadButton
        disabled={!showPlotUHS}
        downloadURL={CONSTANTS.PROJECT_API_DOWNLOAD_UHS}
        downloadToken={{
          uhs_token: downloadToken,
        }}
        extraParams={{
          project_id: projectId,
          station_id: `${projectLocationCode[projectLocation]}_${projectVS30}`,
          rp: getSelectedRP().join(","),
        }}
        fileName="Project_UHS.zip"
      />
    </div>
  );
};

export default HazardViewerUHS;
