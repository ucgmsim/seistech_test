import React, { Fragment, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import { Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalContext } from "context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import IMSelect from "components/common/IMSelect";
import GuideTooltip from "components/common/GuideTooltip";
import * as CONSTANTS from "constants/Constants";
import $ from "jquery";
import { renderSigfigs, sortIMs, handleErrors } from "utils/Utils";
import "assets/style/GMSForm.css";

const GMSForm = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    vs30,
    setGMSComputeClick,
    setGMSIMLevel,
    setGMSExcdRate,
    setGMSIMVector,
    setGMSRadio,
    setGMSIMType,
    setGMSNum,
    setGMSReplicates,
    setGMSWeights,
    setGMSMwMin,
    setGMSMwMax,
    setGMSRrupMin,
    setGMSRrupMax,
    setGMSVS30Min,
    setGMSVS30Max,
  } = useContext(GlobalContext);

  const animatedComponents = makeAnimated();

  const [availableIMs, setAvailableIMs] = useState([]);
  const [localIMs, setLocalIMs] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // To prevent recomputing by itself
    // This occurs when you comes to GMS tab from Home or Projects tab
    setGMSComputeClick(null);

    const getGMSIMs = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.CORE_API_ROUTE_GMS_GET_GM_DATASETS,
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
            const gmDatasetIDs = responseData["gm_dataset_ids"];
            return await fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.CORE_API_ROUTE_GMS_GET_AVAILABLE_GMS +
                `?ensemble_id=${selectedEnsemble}&gm_dataset_ids=${gmDatasetIDs.join(
                  ","
                )}`,
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
                setAvailableIMs(sortIMs(responseData["ims"]));
              })
              // Catch error for the second fetch, IMs
              .catch((error) => {
                console.log(error);
              });
          })
          // Catch error for the first fetch, GM Dataset
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getGMSIMs();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    let localIMs = availableIMs.map((IM) => ({
      value: IM,
      label: IM,
    }));
    setLocalIMs(localIMs);
  }, [availableIMs]);

  const availableDatabases = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
  ];
  const downArrow = <FontAwesomeIcon icon="caret-down" size="2x" />;
  const upArrow = <FontAwesomeIcon icon="caret-up" size="2x" />;

  const arrowSets = {
    true: downArrow,
    false: upArrow,
  };

  const [arrow, setArrow] = useState(true);

  const [selectedIMType, setSelectedIMType] = useState(null);

  const [localNumGMS, setLocalNumGMS] = useState("");
  const [localWeights, setLocalWeights] = useState("");
  const [localDatabase, setLocalDatabase] = useState(null);
  const [localReplicates, setLocalReplicates] = useState(1);

  /*
    Pre-GM Filtering Parameters Table
  */
  const [localMwMin, setLocalMwMin] = useState("");
  const [localMwMax, setLocalMwMax] = useState("");
  const [localRrupMin, setLocalRrupMin] = useState("");
  const [localRrupMax, setLocalRrupMax] = useState("");
  const [localVS30Min, setLocalVS30Min] = useState("");
  const [localVS30Max, setLocalVS30Max] = useState("");

  /*
    IM Level/Exceedance Rate Section
  */

  // IM Level / Exceedance Rate
  const [localIMExdRateRadio, setLocalImExdRateRadio] = useState("im-level");

  const [localIMLevel, setLocalIMLevel] = useState("");

  const [localExcdRate, setLocalExcdRate] = useState("");

  const [getPreGMParamsClick, setGetPreGMParamsClick] = useState(null);
  const [getPreGMButton, setGetPreGMButton] = useState({
    text: "Get causal parameters bounds",
    isFetching: false,
  });

  const validGetPreGMParams = () => {
    if (localIMExdRateRadio === "im-level") {
      if (selectedIMType !== null && localIMLevel !== "") {
        return false;
      }
    } else if (localIMExdRateRadio === "exceedance-rate") {
      if (selectedIMType !== null && localExcdRate !== "") {
        return false;
      }
    }

    return true;
  };
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const defaultCausalParams = async () => {
      if (getPreGMParamsClick !== null) {
        let queryString = `?ensemble_id=${selectedEnsemble}&station=${station}&IM_j=${selectedIMType}&user_vs30=${vs30}`;
        if (localIMExdRateRadio === "im-level") {
          queryString += `&im_level=${localIMLevel}`;
        } else if (localIMExdRateRadio === "exceedance-rate") {
          queryString += `&exceedance=${localExcdRate}`;
        }
        try {
          const token = await getTokenSilently();

          setGetPreGMButton({
            text: <FontAwesomeIcon icon="spinner" spin />,
            isFetching: true,
          });

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_GMS_DEFAULT_CAUSAL_PARAMS +
              queryString,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          )
            .then(async function (response) {
              const responseData = await response.json();
              // For Local table
              setLocalMwMin(responseData.mw_low);
              setLocalMwMax(responseData.mw_high);
              setLocalRrupMin(
                renderSigfigs(responseData.rrup_low, CONSTANTS.APP_UI_SIGFIGS)
              );
              setLocalRrupMax(
                renderSigfigs(responseData.rrup_high, CONSTANTS.APP_UI_SIGFIGS)
              );
              setLocalVS30Min(
                renderSigfigs(responseData.vs30_low, CONSTANTS.APP_UI_SIGFIGS)
              );
              setLocalVS30Max(
                renderSigfigs(responseData.vs30_high, CONSTANTS.APP_UI_SIGFIGS)
              );

              setGetPreGMButton({
                text: "Get causal parameters bounds",
                isFetching: false,
              });
            })
            .catch(function (error) {
              if (error.name !== "AbortError") {
                setGetPreGMButton({
                  text: "Get causal parameters bounds",
                  isFetching: false,
                });
              }
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    defaultCausalParams();

    return () => {
      abortController.abort();
    };
  }, [getPreGMParamsClick]);

  /*
    IM Vector Section
  */
  const [localIMVector, setLocalIMVector] = useState([]);
  const [getIMWeightsClick, setGetIMWeightsClick] = useState(null);

  const [getIMWeightMButton, setGetIMWeightMButton] = useState({
    text: "Get IM vector Weights",
    isFetching: false,
  });

  const validIMVectors = () => {
    return localIMVector.length == 0;
  };

  /*
    Fetch data from Core API -> To get a default weight for each IM Vector.
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const defaultIMWeights = async () => {
      if (localIMVector.length !== 0 && getIMWeightsClick !== null) {
        let queryString = `?IM_j=${selectedIMType}&IMs=`;

        // Create a new array from an object.
        // As localIMVector is an object with properties of label and value
        const newIMVector = Array.from(localIMVector, (x) => x.value);

        // To make a string from a sorted array and separate with comma
        sortIMs(newIMVector).forEach((IM) => (queryString += IM + ","));
        // Remove the last comma
        queryString = queryString.slice(0, -1);

        try {
          const token = await getTokenSilently();

          setGetIMWeightMButton({
            text: <FontAwesomeIcon icon="spinner" spin />,
            isFetching: true,
          });

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_GMS_DEFAULT_IM_WEIGHTS +
              queryString,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          )
            .then(async function (response) {
              const responseData = await response.json();
              setLocalWeights(responseData);

              setGetIMWeightMButton({
                text: "Get IM vector weights",
                isFetching: false,
              });
            })
            .catch(function (error) {
              if (error.name !== "AbortError") {
                setGetIMWeightMButton({
                  text: "Get IM vector weights",
                  isFetching: false,
                });
              }
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    defaultIMWeights();

    return () => {
      abortController.abort();
    };
  }, [getIMWeightsClick]);

  /*
    IM Vector -> Create Weights Table inside Advanced tab
  */
  const [localWeightsTable, setLocalWeightsTable] = useState([]);

  useEffect(() => {
    // To check whether we have any default weights from Core API or NOT
    if (Object.keys(localWeights).length !== 0) {
      setLocalWeightsTable(
        localIMVector.map((imVector) => {
          return (
            <tr id={"weight-row-" + imVector.value} key={imVector.value}>
              <td>{imVector.value}</td>
              <td className="text-center">
                {renderSigfigs(
                  localWeights[imVector.value],
                  CONSTANTS.APP_UI_SIGFIGS
                )}
              </td>
            </tr>
          );
        })
      );
    }
    // If users remove all IM Vectors, then we reset weights table inside Advanced tab
    if (localIMVector.length === 0) {
      setLocalWeightsTable([]);
    }
  }, [localIMVector, localWeights]);

  // Disable table's input
  useEffect(() => {
    if (
      selectedIMType !== null &&
      (localIMLevel !== "" || localExcdRate !== "")
    ) {
      $("table input").prop("disabled", false);
    } else {
      $("table input").prop("disabled", true);
    }
  }, [selectedIMType, localIMLevel, localExcdRate]);

  const validInputs = () => {
    return (
      selectedEnsemble !== ("" && null) &&
      station !== ("" && null) &&
      selectedIMType !== ("" && null) &&
      localIMVector.length !== 0 &&
      localNumGMS !== ("" && null) &&
      localReplicates !== ("" && null) &&
      localWeights !== ("" && null) &&
      localMwMin !== "" &&
      localMwMax !== "" &&
      localRrupMin !== "" &&
      localRrupMax !== "" &&
      localVS30Min !== "" &&
      localVS30Max !== "" &&
      ((localIMExdRateRadio === "exceedance-rate" && localExcdRate !== "") ||
        (localIMExdRateRadio === "im-level" && localIMLevel !== ""))
    );
  };

  const computeGMS = () => {
    localIMExdRateRadio === "im-level"
      ? setGMSIMLevel(localIMLevel)
      : setGMSExcdRate(localExcdRate);
    setGMSIMVector(localIMVector);
    setGMSRadio(localIMExdRateRadio);
    setGMSIMType(selectedIMType);
    setGMSNum(localNumGMS);
    setGMSReplicates(localReplicates);
    setGMSWeights(localWeights);
    setGMSMwMin(localMwMin);
    setGMSMwMax(localMwMax);
    setGMSRrupMin(localRrupMin);
    setGMSRrupMax(localRrupMax);
    setGMSVS30Min(localVS30Min);
    setGMSVS30Max(localVS30Max);
    setGMSComputeClick(uuidv4());
  };

  const preventEnterKey = (e) => {
    e.key === "Enter" && e.preventDefault();
  };

  return (
    <Fragment>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group form-section-title">
          Ground Motion Selection
        </div>

        <div className="custom-form-group">
          <IMSelect
            title="Conditioning IM Name"
            setIM={setSelectedIMType}
            options={availableIMs}
            guideMSG={
              CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_CONDITIONING_IM_NAME"]
            }
          />
        </div>

        <div className="form-group">
          <label
            id="label-im-level"
            htmlFor="im-level"
            className="control-label"
          >
            IM / Exceedance rate level
          </label>
          <GuideTooltip
            explanation={
              CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_IM_LEVEL_EXCEEDANCE_RATE"]
            }
          />
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="inline-radio-options"
                id="im-level-radio"
                value="im-level"
                checked={localIMExdRateRadio === "im-level"}
                onChange={(e) => setLocalImExdRateRadio(e.target.value)}
              />
              <label className="form-check-label" htmlFor="im-level">
                IM
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="inline-radio-options"
                id="exceedance-rate-radio"
                value="exceedance-rate"
                checked={localIMExdRateRadio === "exceedance-rate"}
                onChange={(e) => setLocalImExdRateRadio(e.target.value)}
              />
              <label className="form-check-label" htmlFor="exceedance-rate">
                Exceedance Rate
              </label>
            </div>
          </div>
          {localIMExdRateRadio === "im-level" ? (
            <input
              id="im-level"
              type="number"
              onChange={(e) => setLocalIMLevel(e.target.value)}
              className="form-control"
              value={localIMLevel}
              onKeyPress={(e) => preventEnterKey(e)}
            />
          ) : (
            <input
              id="exceedance-rate"
              type="number"
              onChange={(e) => setLocalExcdRate(e.target.value)}
              className="form-control"
              value={localExcdRate}
              onKeyPress={(e) => preventEnterKey(e)}
            />
          )}
        </div>

        <div className="form-row div-with-status">
          <button
            id="get-pre-gm-params-btn"
            type="button"
            className="btn btn-primary"
            onClick={() => setGetPreGMParamsClick(uuidv4())}
            disabled={
              validGetPreGMParams() || getPreGMButton.isFetching === true
            }
          >
            {getPreGMButton.text}
          </button>
          <span className="status-text">
            {getPreGMButton.isFetching ? "It takes about 1 minute..." : null}
          </span>
        </div>

        <div className="im-custom-form-group">
          <label
            id="label-im-vectors"
            htmlFor="im-vector"
            className="control-label"
          >
            IM Vector
          </label>
          {/* <pre>IM Vector</pre> */}
          <GuideTooltip
            explanation={CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_IM_VECTOR"]}
          />
          <Select
            id="im-vector"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            onChange={(value) => setLocalIMVector(value || [])}
            options={localIMs.filter((e) => {
              return e.value !== selectedIMType;
            })}
            isDisabled={localIMs.length === 0}
          />
        </div>

        <div className="form-row">
          <button
            id="get-im-vector-weights-btn"
            className="btn btn-primary"
            onClick={() => setGetIMWeightsClick(uuidv4())}
            disabled={
              validIMVectors() || getIMWeightMButton.isFetching === true
            }
          >
            {getIMWeightMButton.text}
          </button>
        </div>

        <div className="form-group">
          <label id="label-num-gms" htmlFor="num-gms" className="control-label">
            Number of Ground Motions
          </label>
          <GuideTooltip
            explanation={CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_NUM_GMS"]}
          />
          <input
            id="num-gms"
            type="number"
            onChange={(e) => setLocalNumGMS(e.target.value)}
            className="form-control"
            value={localNumGMS}
            onKeyPress={(e) => preventEnterKey(e)}
          />
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary"
            onClick={() => computeGMS()}
            disabled={!validInputs()}
          >
            Compute
          </button>
        </div>

        <Accordion>
          <Card>
            <Card.Header className="advanced-toggle-header">
              <span>
                Advanced
                <GuideTooltip
                  explanation={
                    CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_ADVANCED"]
                  }
                />
              </span>
              <Accordion.Toggle
                as="span"
                eventKey="0"
                onClick={() => setArrow(!arrow)}
              >
                {arrowSets[arrow]}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <div className="form-group">
                  <label
                    id="label-causal-parameters"
                    htmlFor="causal-parameters"
                    className="control-label"
                  >
                    Causal parameters bounds
                  </label>
                  <GuideTooltip
                    explanation={
                      CONSTANTS.TOOLTIP_MESSAGES[
                        "HAZARD_GMS_CAUSAL_PARAMS_BOUNDS"
                      ]
                    }
                  />
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th className="var-name" scope="col"></th>
                        <th className="min-value" scope="col">
                          Min
                        </th>
                        <th className="min-value" scope="col">
                          Max
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Mw</th>
                        <td>
                          <input
                            type="text"
                            value={localMwMin}
                            onChange={(e) => setLocalMwMin(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localMwMax}
                            onChange={(e) => setLocalMwMax(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Rrup (km)</th>
                        <td>
                          <input
                            type="text"
                            value={localRrupMin}
                            onChange={(e) => setLocalRrupMin(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localRrupMax}
                            onChange={(e) => setLocalRrupMax(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">
                          V<sub>S30</sub> (m/s)
                        </th>
                        <td>
                          <input
                            type="text"
                            value={localVS30Min}
                            onChange={(e) => setLocalVS30Min(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localVS30Max}
                            onChange={(e) => setLocalVS30Max(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="form-group">
                  <label
                    id="label-weights"
                    htmlFor="weights"
                    className="control-label"
                  >
                    Weights
                  </label>
                  <GuideTooltip
                    explanation={
                      CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_WEIGHTS"]
                    }
                  />
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th className="text-center" scope="col">
                          Weights
                        </th>
                      </tr>
                    </thead>
                    <tbody>{localWeightsTable}</tbody>
                  </table>
                </div>

                {/* Options need to be changed but we do not have any yet */}
                <div className="custom-form-group">
                  <label
                    id="label-gms-db"
                    htmlFor="database"
                    className="control-label"
                  >
                    Database
                  </label>
                  <GuideTooltip
                    explanation={CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_DB"]}
                  />
                  <Select
                    id="database"
                    onChange={setLocalDatabase}
                    defaultValue={localDatabase}
                    options={availableDatabases}
                  />
                </div>

                <div className="form-group">
                  <label
                    id="label-replicates"
                    htmlFor="replicates"
                    className="control-label"
                  >
                    Replicates
                  </label>
                  <GuideTooltip
                    explanation={
                      CONSTANTS.TOOLTIP_MESSAGES["HAZARD_GMS_REPLICATES"]
                    }
                  />
                  <input
                    id="replicates"
                    type="number"
                    onChange={(e) => setLocalReplicates(e.target.value)}
                    className="form-control"
                    value={localReplicates}
                    onKeyPress={(e) => preventEnterKey(e)}
                  />
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </form>
    </Fragment>
  );
};

export default GMSForm;
