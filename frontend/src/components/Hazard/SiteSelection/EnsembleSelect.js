import React, { useContext, Fragment, useEffect, useState } from "react";

import Select from "react-select";

import * as CONSTANTS from "constants/Constants";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import { handleErrors } from "utils/Utils";

const EnsembleSelect = () => {
  const { getTokenSilently } = useAuth0();

  const { setSelectedEnsemble } = useContext(GlobalContext);

  const [ensembleIds, setEnsembleIds] = useState([]);

  const [optionItems, setOptionItems] = useState([]);

  useEffect(() => {
    let optionItems = ensembleIds.map((ensemble) => ({
      value: ensemble,
      label: ensemble,
    }));
    setOptionItems(optionItems);
  }, [ensembleIds]);

  // Get the available ensemble ids
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getEnsembleIds = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.CORE_API_ENSEMBLE_IDS_ENDPOINT,
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
            setEnsembleIds(responseData["ensemble_ids"]);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getEnsembleIds();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Fragment>
      <Select
        id="ensemble-select"
        onChange={(e) => setSelectedEnsemble(e.value)}
        defaultValue={{ value: "v20p5emp", label: "v20p5emp" }}
        options={optionItems}
        isDisabled={ensembleIds.length === 0 || CONSTANTS.ENV === "EA"}
        isSearchable={false}
      />
    </Fragment>
  );
};

export default EnsembleSelect;
