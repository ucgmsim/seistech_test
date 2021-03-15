import React, { Fragment, useContext, useState, useEffect } from "react";

import { Tabs, Tab } from "react-bootstrap";
import Select from "react-select";
import dompurify from "dompurify";

import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import { useAuth0 } from "components/common/ReactAuth0SPA";

import {
  GMSViewerIMDistributions,
  GMSViewerSpectra,
  GMSViewerMwRrupPlot,
  GMSViewerCausalParameters,
} from "components/Hazard/GMS";
import {
  LoadingSpinner,
  DownloadButton,
  GuideMessage,
  ErrorMessage,
} from "components/common";
import { handleErrors, GMSIMLabelConverter, arrayEquals } from "utils/Utils";
import { calculateGMSSpectra } from "utils/calculations/CalculateGMSSpectra";

import "assets/style/GMSViewer.css";

const GMSViewer = () => {
  const { getTokenSilently } = useAuth0();

  const sanitizer = dompurify.sanitize;

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
  const [isValidGMSData, setIsValidGMSData] = useState(false);
  // Cloned object for each plots
  const [clonedGMSCausal, setClonedGMSCausal] = useState({});
  const [clonedGMSIMDistribution, setClonedGMSIMDistribution] = useState({});
  const [clonedGMSMwRrup, setClonedGMSMwRrup] = useState({});
  const [clonedGMSSpectra, setClonedGMSSpectra] = useState([]);

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

  const [causalParamBounds, setCausalParamBounds] = useState({});

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

          // Create an IMVectors array with only values
          const newIMVector = GMSIMVector.map((vector) => {
            return vector.value;
          });

          // Creating an object of Bounds to comput GMS
          const filterParamsObj = {
            mag_low: Number(GMSMwMin),
            mag_high: Number(GMSMwMax),
            rrup_low: Number(GMSRrupMin),
            rrup_high: Number(GMSRrupMax),
            vs30_low: Number(GMSVS30Min),
            vs30_high: Number(GMSVS30Max),
          };

          // Min/Max values for one of the plots
          setCausalParamBounds({
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
            CONSTANTS.CORE_API_BASE_URL + CONSTANTS.CORE_API_GMS_ENDPOINT,
            requestOptions
          )
            .then(handleErrors)
            .then(async (response) => {
              const responseData = await response.json();
              setComputedGMS(responseData);
              setSelectedIMVectors(newIMVector);
              setDownloadToken(responseData["download_token"]);

              // Validate the computed data to see whether its valid
              setIsValidGMSData(validateComputedGMS(responseData));

              // Deep clone the object for each plots component to avoid any potential change
              setClonedGMSSpectra(
                calculateGMSSpectra(JSON.parse(JSON.stringify(responseData)))
              );
              setClonedGMSCausal(JSON.parse(JSON.stringify(responseData)));
              setClonedGMSIMDistribution(
                JSON.parse(JSON.stringify(responseData))
              );
              setClonedGMSMwRrup(JSON.parse(JSON.stringify(responseData)));

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
        label: `Magnitude and rupture distance (Mw-R${"rup".sub()}) distribution`,
      });

      // Set the first Metadata as a default metadata for plot
      setSpecifiedMetadata(tempMetadatas[1]);

      setLocalMetadatas(tempMetadatas);
    }
  }, [computedGMS]);

  /*
      Lastly, check whether this object has the properties we are looking for
      E.g., gmsData object must have properties of:
      1. gcim_cdf_x
      2. gcim_cdf_y
      3. realisations
      4. selected_GMs
      5. ks_bounds - Checked by second checker
      6. metadata
      7. im_j - Checked by second checker
      8. IMs
      9. IM_j - Checked by second checker
      1 ~ 3 are another objects and these should also have
      properties of selected IMVectors
      For instance, selected IMVectors are PGA, pSA_0.01 and pSA_0.03
      Then 1~3 objects must have properties of PGA, pSA_0.01 and pSA_0.03
    */
  const validateComputedGMS = (providedGMSData) => {
    // First, check whether we actually got computed GMS (providedGMSData)
    if (providedGMSData === undefined || providedGMSData === null) {
      return false;
    }

    // Second, check each values of the object, providedGMSData
    Object.values(providedGMSData).forEach((x) => {
      // Like ks_bound value is Number and is not working with Object.keys(x).length
      if (!isNaN(x)) {
        return;
      }
      // When an object doesn't have any values
      if (Object.keys(x).length === 0) {
        return false;
      }
    });

    // Compare IMVectors and selected Vectors to see if they are matching
    const sortedSelectedIMVector = GMSIMVector.map((im) => im.value).sort();

    if (!arrayEquals(providedGMSData["IMs"].sort(), sortedSelectedIMVector)) {
      setShowErrorMessage({ isError: true, errorCode: "gms_im" });
      return false;
    }

    // Compare if gcim_cdf_x has the keys of IMs
    if (
      !arrayEquals(
        Object.keys(providedGMSData["gcim_cdf_x"]).sort(),
        sortedSelectedIMVector
      )
    ) {
      setShowErrorMessage({ isError: true, errorCode: "gms_gcim_cdf_x" });
      return false;
    }

    // Compare if gcim_cdf_y has the keys of IMs
    if (
      !arrayEquals(
        Object.keys(providedGMSData["gcim_cdf_y"]).sort(),
        sortedSelectedIMVector
      )
    ) {
      setShowErrorMessage({ isError: true, errorCode: "gms_gcim_cdf_y" });
      return false;
    }

    // Compare if realisations has the keys of IMs
    if (
      !arrayEquals(
        Object.keys(providedGMSData["realisations"]).sort(),
        sortedSelectedIMVector
      )
    ) {
      setShowErrorMessage({ isError: true, errorCode: "gms_realisations" });
      return false;
    }

    // Compare if selectedGMs has the keys of IMs
    // providedGMSData["selected_GMs"]

    // Compare if IM_j equals to the selected IM Type
    if (providedGMSData["IM_j"] !== GMSIMType) {
      setShowErrorMessage({ isError: true, errorCode: "gms_IM_j" });
      return false;
    }

    // Compare if metadata has the keys of mag, rrup, sf and vs30
    if (
      !arrayEquals(
        Object.keys(providedGMSData["metadata"]).sort(),
        Object.keys(CONSTANTS.GMS_LABELS).sort()
      )
    ) {
      setShowErrorMessage({ isError: true, errorCode: "gms_metadata" });
      return false;
    }

    return true;
  };

  const validateBounds = () => {
    let isValidated = false;
    Object.values(causalParamBounds).forEach(
      (x) => (isValidated = x === "" ? false : true)
    );
    return isValidated;
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
            showErrorMessage.isError === false && (
              <Fragment>
                {isValidGMSData ? (
                  <Fragment>
                    <Select
                      id="im-vectors"
                      onChange={(value) => setSpecifiedIM(value || [])}
                      defaultValue={specifiedIM}
                      options={localIMVectors}
                      isSearchable={false}
                    />
                    {specifiedIM.value === "spectra" ? (
                      <GMSViewerSpectra clonedGMSSpectra={clonedGMSSpectra} />
                    ) : (
                      <GMSViewerIMDistributions
                        gmsData={clonedGMSIMDistribution}
                        IM={specifiedIM.value}
                      />
                    )}
                  </Fragment>
                ) : (
                  <ErrorMessage errorCode={showErrorMessage.errorCode} />
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
                {isValidGMSData ? (
                  <Fragment>
                    <Select
                      id="metadata"
                      onChange={(value) => setSpecifiedMetadata(value || [])}
                      defaultValue={specifiedMetadata}
                      options={localMetadatas}
                      isSearchable={false}
                      formatOptionLabel={(data) => {
                        return (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sanitizer(data.label),
                            }}
                          />
                        );
                      }}
                    />
                    {specifiedMetadata.value === "mwrrupplot" ? (
                      <GMSViewerMwRrupPlot
                        gmsData={clonedGMSMwRrup}
                        causalParamBounds={causalParamBounds}
                      />
                    ) : (
                      <GMSViewerCausalParameters
                        gmsData={clonedGMSCausal}
                        metadata={specifiedMetadata.value}
                        causalParamBounds={causalParamBounds}
                      />
                    )}
                  </Fragment>
                ) : (
                  <ErrorMessage errorCode={showErrorMessage.errorCode} />
                )}
              </Fragment>
            )}
        </Tab>
      </Tabs>
      <DownloadButton
        // disabled={computedGMS === null || computedGMS["IM_j"] !== GMSIMType}
        disabled
        downloadURL={CONSTANTS.CORE_API_GMS_DOWNLOAD_ENDPOINT}
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
