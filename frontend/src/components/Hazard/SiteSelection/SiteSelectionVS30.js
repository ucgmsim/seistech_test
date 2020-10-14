import React, { useContext, useEffect, useState } from "react";

import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import LoadingSpinner from "components/common/LoadingSpinner";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";
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
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getVS30Plot = async () => {
      if (locationSetClick !== null) {
        try {
          const token = await getTokenSilently();
          setShowSpinner(true);
          setShowErrorMessage(false);

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
            .then(async function (response) {
              const responseData = await response.json();
              setShowSpinner(false);
              setVS30Map(responseData["vs30_plot"]);
            })
            .catch(function (error) {
              setShowSpinner(false);
              setShowErrorMessage(true);
              console.log(error);
            });
        } catch (error) {
          setShowSpinner(false);
          setShowErrorMessage(true);
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
    <div>
      {locationSetClick == null && (
        <GuideMessage
          header={CONSTANTS.SITE_SELECTION_VS30_TITLE}
          body={CONSTANTS.SITE_SELECTION_VS30_MSG}
          instruction={CONSTANTS.SITE_SELECTION_VS30_INSTRUCTION}
        />
      )}

      {showSpinner === true && locationSetClick !== null && <LoadingSpinner />}

      {locationSetClick !== null &&
        showSpinner === false &&
        showErrorMessage === true && <ErrorMessage />}

      {vs30Map !== null && showSpinner === false && (
        <img
          className="rounded mx-auto d-block img-fluid"
          src={`data:image/png;base64,${vs30Map}`}
          alt="Context plot"
        />
      )}
    </div>
  );
};

export default SiteSelectionVs30;
