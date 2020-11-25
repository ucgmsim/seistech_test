import React, { Fragment, useContext, useEffect, useState } from "react";

import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";

import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import LoadingSpinner from "components/common/LoadingSpinner";

import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";

import RegionalMap from "./SiteSelectionRegional";
import VS30Map from "./SiteSelectionVS30";
import { handleErrors } from "utils/Utils";

const SiteSelectionViewer = () => {
  const { getTokenSilently } = useAuth0();

  const {
    projectId,
    projectLocation,
    projectVS30,
    projectLocationCode,
    projectSiteSelectionGetClick,
  } = useContext(GlobalContext);

  const [showSpinner, setShowSpinner] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [regionalMap, setRegionalMap] = useState(null);
  const [vs30Map, setVS30Map] = useState(null);

  useEffect(() => {
    setShowSpinner(false);
    setShowImages(false);
  }, [projectId, projectVS30, projectLocation]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getMaps = async () => {
      if (projectSiteSelectionGetClick !== null) {
        try {
          setShowImages(false);
          setShowSpinner(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          const token = await getTokenSilently();

          let queryString = `?project_id=${projectId}&station_id=${projectLocationCode[projectLocation]}_${projectVS30}`;

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_PROJECT_MAPS +
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
              setRegionalMap(responseData["context_plot"]);
              setVS30Map(responseData["vs30_plot"]);
              setShowSpinner(false);
              setShowImages(true);
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                setShowSpinner(false);
                setShowErrorMessage({ isError: true, errorCode: error });
              }

              console.log(error);
            });
        } catch (error) {
          setShowSpinner(false);
          setShowErrorMessage({ isError: true, errorCode: error });
          console.log(error);
        }
      }
    };
    getMaps();

    return () => {
      abortController.abort();
    };
  }, [projectSiteSelectionGetClick]);

  return (
    <Fragment>
      <Tabs defaultActiveKey="regional">
        <Tab eventKey="regional" title="Regional">
          {projectSiteSelectionGetClick === null && (
            <GuideMessage
              header={CONSTANTS.HAZARD_CURVE}
              body={CONSTANTS.HAZARD_CURVE_WARNING_MSG}
              instruction={CONSTANTS.HAZARD_CURVE_INSTRUCTION}
            />
          )}
          {showSpinner === true &&
            projectSiteSelectionGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectSiteSelectionGetClick !== null &&
            showSpinner === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinner === false &&
            showImages === true &&
            regionalMap !== null &&
            showErrorMessage.isError === false && (
              <RegionalMap source={regionalMap} />
            )}
        </Tab>

        <Tab eventKey="vs30" title="VS30">
          {projectSiteSelectionGetClick === null && (
            <GuideMessage
              header={CONSTANTS.HAZARD_CURVE}
              body={CONSTANTS.HAZARD_CURVE_WARNING_MSG}
              instruction={CONSTANTS.HAZARD_CURVE_INSTRUCTION}
            />
          )}
          {showSpinner === true &&
            projectSiteSelectionGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectSiteSelectionGetClick !== null &&
            showSpinner === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinner === false &&
            showImages === true &&
            regionalMap !== null &&
            showErrorMessage.isError === false && <VS30Map source={vs30Map} />}
        </Tab>
      </Tabs>
    </Fragment>
  );
};
export default SiteSelectionViewer;
