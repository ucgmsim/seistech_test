import React, { Fragment, useContext, useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";
import Select from "react-select";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import FirstPlot from "./FirstPlot";
import SecondPlot from "./SecondPlot";
import ThirdPlot from "./ThirdPlot";
import FourthPlot from "./FourthPlot";
import LoadingSpinner from "components/common/LoadingSpinner";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";

import { handleErrors } from "utils/Utils";

import "assets/style/GMSViewer.css";

const GMSViewer = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    isLoading,
    setIsLoading,
    computedGMS,
    setComputedGMS,
    selectedIMVectors,
    setSelectedIMVectors,
    GMSComputeClick,
    GMSIMLevel,
    GMSExcdRate,
    GMSIMVector,
    GMSRadio,
    GMSIMType,
    GMSNum,
    GMSReplicats,
    GMSWeights,
  } = useContext(GlobalContext);

  const [specifiedIM, setSpecifiedIM] = useState([]);
  const [localIMVectors, setLocalIMVectors] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [specifiedMetadata, setSpecifiedMetadata] = useState([]);
  const [localMetadatas, setLocalMetadatas] = useState([]);

  /*
    Fetch data from Core API -> compute_ensemble_GMS
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const computeEnsembleGMS = async () => {
      if (
        GMSComputeClick !== null &&
        (GMSIMLevel !== "" || GMSExcdRate !== "")
      ) {
        try {
          const token = await getTokenSilently();
          setIsLoading(true);
          const newIMVector = GMSIMVector.map((vector) => {
            return vector.value;
          });

          let requestOptions = {};

          if (GMSRadio === "im-level") {
            requestOptions = {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ensemble_id: selectedEnsemble,
                station: station,
                IM_j: GMSIMType,
                IMs: newIMVector,
                n_gms: Number(GMSNum),
                gm_source_ids: ["nga_west_2"],
                im_level: Number(GMSIMLevel),
                n_replica: Number(GMSReplicats),
                IM_weights: GMSWeights,
              }),
              signal: signal,
            };
          } else if (GMSRadio === "exceedance-rate") {
            requestOptions = {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ensemble_id: selectedEnsemble,
                station: station,
                IM_j: GMSIMType,
                IMs: newIMVector,
                n_gms: Number(GMSNum),
                gm_source_ids: ["nga_west_2"],
                exceedance: Number(GMSExcdRate),
                n_replica: Number(GMSReplicats),
                IM_weights: GMSWeights,
              }),
              signal: signal,
            };
          }

          await fetch(
            CONSTANTS.CORE_API_BASE_URL + CONSTANTS.CORE_API_ROUTE_GMS_COMPUTE,
            requestOptions
          )
            .then(handleErrors)
            .then(async function (response) {
              const responseData = await response.json();
              setComputedGMS(responseData);
              setSelectedIMVectors(newIMVector);
              setIsLoading(false);
            })
            .catch(function (error) {
              setIsLoading(false);
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    computeEnsembleGMS();

    return () => {
      abortController.abort();
    };
  }, [GMSComputeClick]);

  useEffect(() => {
    // Create proper IM array for Select package
    let localIMs = selectedIMVectors.map((IM) => ({
      value: IM,
      label: IM,
    }));
    setLocalIMVectors(localIMs);
    console.log(selectedIMVectors);

    // Set the first IM as a default IM for plot
    setSpecifiedIM(localIMs[0]);

    // Create an object key = IM, value = Period
    let localPeriods = {};
    selectedIMVectors.forEach((IM) => {
      localPeriods[IM] = IM.split("_")[1];
    });
    setPeriods(localPeriods);
  }, [selectedIMVectors]);

  useEffect(() => {
    if (computedGMS !== null) {
      const metadatas = computedGMS["metadata"];
      let localMetadatas = Object.getOwnPropertyNames(metadatas).map(
        (metadata) => ({
          value: metadata,
          label: metadata,
        })
      );

      // Set the first Metadata as a default metadata for plot
      setSpecifiedMetadata(localMetadatas[0]);

      setLocalMetadatas(localMetadatas);
    }
  }, [computedGMS]);

  const validateComputedGMS = () => {
    let isValidResponse = true;
    Object.values(computedGMS).forEach((x) => {
      if (!isNaN(x)) {
        return;
      }
      if (Object.keys(x).length === 0) {
        isValidResponse = false;
      }
    });

    return isValidResponse;
  };

  return (
    <div className="gms-viewer">
      <Tabs defaultActiveKey="firstPlot">
        <Tab eventKey="firstPlot" title="Specific IM">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : (
                <Fragment>
                  <Select
                    id="im-vectors"
                    onChange={(value) => setSpecifiedIM(value || [])}
                    defaultValue={specifiedIM}
                    options={localIMVectors}
                  />
                  <FirstPlot gmsData={computedGMS} IM={specifiedIM.value} />
                </Fragment>
              )}
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="secondPlot" title="Second Plot">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {/* {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : ( */}
              <SecondPlot gmsData={computedGMS} periods={periods} />
              {/* )} */}
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="thirdPlot" title="Third Plot">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {/* {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : ( */}
              <Fragment>
                <ThirdPlot gmsData={computedGMS} />
              </Fragment>
              {/* )} */}
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="fourthPlot" title="Fourth Plot">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {/* {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : ( */}
              <Fragment>
                <Select
                  id="metadata"
                  onChange={(value) => setSpecifiedMetadata(value || [])}
                  defaultValue={specifiedMetadata}
                  options={localMetadatas}
                />

                <FourthPlot
                  gmsData={computedGMS}
                  metadata={specifiedMetadata.value}
                />
              </Fragment>
              {/* )} */}
            </Fragment>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default GMSViewer;
