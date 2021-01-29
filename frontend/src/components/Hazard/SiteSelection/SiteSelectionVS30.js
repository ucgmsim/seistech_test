import React, { useContext, useEffect, useState, Fragment } from "react";

import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import { LoadingSpinner, GuideMessage, ErrorMessage } from "components/common";

import { handleErrors } from "utils/Utils";

const SiteSelectionVs30 = () => {
  const { getTokenSilently } = useAuth0();

  const {
    locationSetClick,
    selectedEnsemble,
    siteSelectionLng,
    siteSelectionLat,
  } = useContext(GlobalContext);

  const [vs30Map, setVS30Map] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getVS30Plot = async () => {
      if (locationSetClick !== null) {
        try {
          const token = await getTokenSilently();
          setShowSpinner(true);
          setShowErrorMessage({ isError: false, errorCode: null });

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_VS30_MAP +
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
              setVS30Map(responseData["vs30_plot"]);
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
    getVS30Plot();

    return () => {
      abortController.abort();
    };
  }, [locationSetClick]);

  return (
    <Fragment>
      {locationSetClick === null && (
        <GuideMessage
          header={CONSTANTS.SITE_SELECTION_VS30_TITLE}
          body={CONSTANTS.SITE_SELECTION_VS30_MSG}
          instruction={CONSTANTS.SITE_SELECTION_VS30_INSTRUCTION}
        />
      )}

      {showSpinner === true && locationSetClick !== null && <LoadingSpinner />}

      {locationSetClick !== null &&
        showSpinner === false &&
        showErrorMessage.isError === true && (
          <ErrorMessage errorCode={showErrorMessage.errorCode} />
        )}

      {vs30Map !== null &&
        showSpinner === false &&
        showErrorMessage.isError === false && (
          <img
            className="rounded mx-auto d-block img-fluid"
            src={`data:image/png;base64,${vs30Map}`}
            alt="VS30 Map"
          />
        )}
    </Fragment>
  );
};

export default SiteSelectionVs30;
