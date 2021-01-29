import React, { useContext, useEffect, useState, Fragment } from "react";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import { GlobalContext } from "context";

import { LoadingSpinner, GuideMessage, ErrorMessage } from "components/common";

import { handleErrors } from "utils/Utils";

const SiteSelectionRegional = () => {
  const { getTokenSilently } = useAuth0();

  const {
    locationSetClick,
    selectedEnsemble,
    siteSelectionLng,
    siteSelectionLat,
  } = useContext(GlobalContext);

  const [contextPlot, setContextPlot] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getContextPlot = async () => {
      if (locationSetClick !== null) {
        try {
          const token = await getTokenSilently();
          setShowSpinner(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_CONTEXT_MAP +
              `?ensemble_id=${selectedEnsemble}&lon=${siteSelectionLng}&lat=${siteSelectionLat}`,
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
              setShowSpinner(false);
              setContextPlot(responseData["context_plot"]);
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
    getContextPlot();

    return () => {
      abortController.abort();
    };
  }, [locationSetClick]);

  return (
    <Fragment>
      {locationSetClick === null && (
        <GuideMessage
          header={CONSTANTS.SITE_SELECTION_REGIONAL_TITLE}
          body={CONSTANTS.SITE_SELECTION_REGIONAL_MSG}
          instruction={CONSTANTS.SITE_SELECTION_REGIONAL_INSTRUCTION}
        />
      )}

      {showSpinner === true && locationSetClick !== null && <LoadingSpinner />}

      {locationSetClick !== null &&
        showSpinner === false &&
        showErrorMessage.isError === true && (
          <ErrorMessage errorCode={showErrorMessage.errorCode} />
        )}

      {contextPlot !== null &&
        showSpinner === false &&
        showErrorMessage.isError === false && (
          <img
            className="rounded mx-auto d-block img-fluid"
            src={`data:image/png;base64,${contextPlot}`}
            alt="Regional Map"
          />
        )}
    </Fragment>
  );
};

export default SiteSelectionRegional;
