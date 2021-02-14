import React, { Fragment, useContext, useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";
import Select from "react-select";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import GMSViewerIMDistributions from "./GMSViewerIMDistributions";
import GMSViewerSpectra from "./GMSViewerSpectra";
import GMSViewerMwRrupPlot from "./GMSViewerMwRrupPlot";
import GMSViewerCausalParameters from "./GMSViewerCausalParameters";
import LoadingSpinner from "components/common/LoadingSpinner";
import DownloadButton from "components/common/DownloadButton";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";

import { handleErrors, GMSIMLabelConverter } from "utils/Utils";

import "assets/style/GMSViewer.css";

const GMSViewer = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    vs30,
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
    GMSVS30Min,
    GMSVS30Max,
  } = useContext(GlobalContext);

  const [selectedIMVectors, setSelectedIMVectors] = useState([]);

  const [computedGMS, setComputedGMS] = useState(null);

  const [specifiedIM, setSpecifiedIM] = useState([]);
  const [localIMVectors, setLocalIMVectors] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [specifiedMetadata, setSpecifiedMetadata] = useState([]);
  const [localMetadatas, setLocalMetadatas] = useState([]);

  const [downloadToken, setDownloadToken] = useState("");

  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  let causalParamBounds = {
    mag: {
      min: GMSMwMin,
      max: GMSMwMax,
    },
    rrup: {
      min: GMSRrupMin,
      max: GMSRrupMax,
    },
    vs30: {
      min: GMSVS30Min,
      max: GMSVS30Max,
      vs30: vs30,
    },
  };

  let filterParamsObj = {
    mag_low: Number(GMSMwMin),
    mag_high: Number(GMSMwMax),
    rrup_low: Number(GMSRrupMin),
    rrup_high: Number(GMSRrupMax),
    vs30_low: Number(GMSVS30Min),
    vs30_high: Number(GMSVS30Max),
  };

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

          let requestOptions = {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            signal: signal,
          };

          if (GMSRadio === "im-level") {
            requestOptions["body"] = JSON.stringify({
              ensemble_id: selectedEnsemble,
              station: station,
              IM_j: GMSIMType,
              IMs: newIMVector,
              n_gms: Number(GMSNum),
              gm_source_ids: ["nga_west_2"],
              im_level: Number(GMSIMLevel),
              n_replica: Number(GMSReplicates),
              IM_weights: GMSWeights,
              filter_params: filterParamsObj,
            });
          } else if (GMSRadio === "exceedance-rate") {
            requestOptions["body"] = JSON.stringify({
              ensemble_id: selectedEnsemble,
              station: station,
              IM_j: GMSIMType,
              IMs: newIMVector,
              n_gms: Number(GMSNum),
              gm_source_ids: ["nga_west_2"],
              exceedance: Number(GMSExcdRate),
              n_replica: Number(GMSReplicates),
              IM_weights: GMSWeights,
              filter_params: filterParamsObj,
            });
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
              setDownloadToken(responseData["download_token"]);
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
      label: GMSIMLabelConverter(IM),
    }));
    localIMs.splice(0, 0, {
      value: "spectra",
      label: "Pseudo acceleration response spectra",
    });
    setLocalIMVectors(localIMs);

    // Set the first IM as a default IM for plot
    setSpecifiedIM(localIMs[1]);
  }, [selectedIMVectors]);

  useEffect(() => {
    if (computedGMS !== null) {
      const metadatas = computedGMS["metadata"];
      let tempMetadatas = Object.getOwnPropertyNames(metadatas).map(
        (metadata) => ({
          value: metadata,
          label: `${CONSTANTS.GMS_LABELS[metadata]} distribution`,
        })
      );
      tempMetadatas.splice(0, 0, {
        value: "mwrrupplot",
        label: "Magnitude and rupture distance (Mw-Rrup) distribution",
      });

      // Set the first Metadata as a default metadata for plot
      setSpecifiedMetadata(tempMetadatas[1]);

      setLocalMetadatas(tempMetadatas);
    }
  }, [computedGMS]);

  const validateComputedGMS = () => {
    let isValidResponse = true;
    Object.values(computedGMS).forEach((x) => {
      // Like ks_bound value is Number and is not working with Object.keys(x).length
      if (!isNaN(x)) {
        return;
      }
      // When an object doesn't have and values
      if (Object.keys(x).length === 0) {
        isValidResponse = false;
      }
    });

    return isValidResponse;
  };

  return (
    <div className="gms-viewer">
      <Tabs defaultActiveKey="GMSViewerIMDistributions">
        <Tab eventKey="GMSViewerIMDistributions" title="IM Distributions">
          {GMSComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {GMSComputeClick !== null &&
            isLoading === true &&
            showErrorMessage.isError === false && <LoadingSpinner />}
          {isLoading === false && showErrorMessage.isError === true && (
            <ErrorMessage errorCode={showErrorMessage.errorCode} />
          )}
          {isLoading === false &&
            computedGMS !== null &&
            computedGMS["IM_j"] === GMSIMType &&
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
                      isSearchable={false}
                    />
                    {specifiedIM.value === "spectra" ? (
                      <GMSViewerSpectra
                        gmsData={computedGMS}
                        periods={selectedIMVectors}
                        im_type={GMSIMType}
                        im_j={
                          GMSRadio === "im-level"
                            ? Number(GMSIMLevel)
                            : Number(GMSExcdRate)
                        }
                      />
                    ) : (
                      <GMSViewerIMDistributions
                        gmsData={computedGMS}
                        IM={specifiedIM.value}
                      />
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
        </Tab>
        <Tab eventKey="GMSViewerCausalParameters" title="Causal Parameters">
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
                      isSearchable={false}
                    />
                    {specifiedMetadata.value === "mwrrupplot" ? (
                      <GMSViewerMwRrupPlot
                        gmsData={computedGMS}
                        causalParamBounds={causalParamBounds}
                      />
                    ) : (
                      <GMSViewerCausalParameters
                        gmsData={computedGMS}
                        metadata={specifiedMetadata.value}
                        causalParamBounds={causalParamBounds}
                      />
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
        </Tab>
      </Tabs>
      <DownloadButton
        // disabled={computedGMS === null || computedGMS["IM_j"] !== GMSIMType}
        disabled
        downloadURL={CONSTANTS.CORE_API_DOWNLOAD_GMS}
        downloadToken={{
          gms_token: downloadToken,
        }}
        extraParams={{
          gms_token: "Download part will be fixed after a chat to Claudio.",
        }}
        fileName="gms.zip"
      />
    </div>
  );
};

export default GMSViewer;
