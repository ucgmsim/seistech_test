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
    selectedIMVectors,
    setSelectedIMVectors,
    GMSComputeClick,
    GMSIMLevel,
    GMSExcdRate,
    GMSIMVector,
    GMSRadio,
    GMSIMType,
    GMSNum,
    GMSReplicates,
    GMSWeights,
    GMSMwMin,
    GMSMwMax,
    GMSRrupMin,
    GMSRrupMax,
  } = useContext(GlobalContext);

  const [computedGMS, setComputedGMS] = useState(null);

  const [specifiedIM, setSpecifiedIM] = useState([]);
  const [localIMVectors, setLocalIMVectors] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [specifiedMetadata, setSpecifiedMetadata] = useState([]);
  const [localMetadatas, setLocalMetadatas] = useState([]);

  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  let causalParamBounds = {
    Mwmin: GMSMwMin,
    Mwmax: GMSMwMax,
    Rrupmin: GMSRrupMin,
    Rrupmax: GMSRrupMax,
  };

  console.log(causalParamBounds);

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
          setShowErrorMessage({ isError: false, errorCode: null });

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
                n_replica: Number(GMSReplicates),
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
                n_replica: Number(GMSReplicates),
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
            .then(async (response) => {
              const responseData = await response.json();
              setComputedGMS(responseData);
              setSelectedIMVectors(newIMVector);
              setIsLoading(false);
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                setIsLoading(false);
                setShowErrorMessage({ isError: true, errorCode: error });
              }

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
        console.log("Its me!");
        console.log(x);
        return;
      }
      if (Object.keys(x).length === 0) {
        console.log("SOMETHING IS AN EMPTY OBJECT");
        console.log(x);
        isValidResponse = false;
      }
    });

    return isValidResponse;
  };

  return (
    <div className="gms-viewer">
      <Tabs defaultActiveKey="firstPlot">
        <Tab eventKey="firstPlot" title="Peak ground velocity">
          {GMSComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && showErrorMessage.isError === false && (
            <LoadingSpinner />
          )}
          {isLoading === false && showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}
          {isLoading === false &&
            computedGMS !== null &&
            showErrorMessage.isError === false && (
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
        <Tab eventKey="secondPlot" title="Pseudo acceleration response spectra">
          {GMSComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && showErrorMessage.isError === false && (
            <LoadingSpinner />
          )}
          {isLoading === false && showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}
          {isLoading === false &&
            computedGMS !== null &&
            showErrorMessage.isError === false && (
              <Fragment>
                {validateComputedGMS() === false ? (
                  <ErrorMessage />
                ) : (
                  <SecondPlot gmsData={computedGMS} periods={periods} />
                )}
              </Fragment>
            )}
        </Tab>
        <Tab eventKey="thirdPlot" title="Third Plot">
          {GMSComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && showErrorMessage.isError === false && (
            <LoadingSpinner />
          )}
          {isLoading === false && showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}
          {isLoading === false &&
            computedGMS !== null &&
            showErrorMessage.isError === false && (
              <Fragment>
                {validateComputedGMS() === false ? (
                  <ErrorMessage />
                ) : (
                  <Fragment>
                    <ThirdPlot
                      gmsData={computedGMS}
                      causalParamBounds={causalParamBounds}
                    />
                  </Fragment>
                )}
              </Fragment>
            )}
        </Tab>
        <Tab eventKey="fourthPlot" title="Fourth Plot">
          {GMSComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && showErrorMessage.isError === false && (
            <LoadingSpinner />
          )}
          {isLoading === false && showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}
          {isLoading === false &&
            computedGMS !== null &&
            showErrorMessage.isError === false && (
              <Fragment>
                {validateComputedGMS() === false ? (
                  <ErrorMessage />
                ) : (
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
                )}
              </Fragment>
            )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default GMSViewer;
