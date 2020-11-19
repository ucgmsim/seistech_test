import React, { Fragment, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import { Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalContext } from "context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import IMSelect from "components/common/IMSelect";
import * as CONSTANTS from "constants/Constants";
import $ from "jquery";
import { renderSigfigs, orderIMs, handleErrors } from "utils/Utils";
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
                setAvailableIMs(orderIMs(responseData["ims"]));
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

  // IM Level / Exceedance Rate
  const [localIMExdRateRadio, setLocalImExdRateRadio] = useState("im-level");

  /*
    Pre-GM Filtering Parameters Table
  */
  const [localMwMin, setLocalMwMin] = useState("");
  const [localMwMax, setLocalMwMax] = useState("");
  const [localRrupMin, setLocalRrupMin] = useState("");
  const [localRrupMax, setLocalRrupMax] = useState("");
  const [localVS30Min, setLocalVS30Min] = useState("");
  const [localVS30Max, setLocalVS30Max] = useState("");

  const [isLocalMwMinChosen, setIsLocalMwMinChosen] = useState(false);
  const [isLocalMwMaxChosen, setIsLocalMwMaxChosen] = useState(false);
  const [isLocalRrupMinChosen, setIsLocalRrupMinChosen] = useState(false);
  const [isLocalRrupMaxChosen, setIsLocalRrupMaxChosen] = useState(false);
  const [isLocalVS30MinChosen, setIsLocalVS30MinChosen] = useState(false);
  const [isLocalVS30MaxChosen, setIsLocalVS30MaxChosen] = useState(false);

  /*
    Setting those as global variable to be used in GMS Viewer to draw a box
  */
  useEffect(() => {
    if (isLocalMwMinChosen === true) {
      setGMSMwMin(localMwMin);
    }
  }, [localMwMin, isLocalMwMinChosen]);

  useEffect(() => {
    if (isLocalMwMaxChosen === true) {
      setGMSMwMax(localMwMax);
    }
  }, [localMwMax, isLocalMwMaxChosen]);

  useEffect(() => {
    if (isLocalRrupMinChosen === true) {
      setGMSRrupMin(localRrupMin);
    }
  }, [localRrupMin, isLocalRrupMinChosen]);

  useEffect(() => {
    if (isLocalRrupMaxChosen === true) {
      setGMSRrupMax(localRrupMax);
    }
  }, [localRrupMax, isLocalRrupMaxChosen]);

  useEffect(() => {
    if (isLocalVS30MinChosen === true) {
      setGMSVS30Min(localVS30Min);
    }
  }, [localVS30Min, setIsLocalVS30MinChosen]);

  useEffect(() => {
    if (isLocalVS30MaxChosen === true) {
      setGMSVS30Max(localVS30Max);
    }
  }, [localVS30Max, setIsLocalVS30MaxChosen]);


  /*
    IM Level/Exceedance Rate Section
  */
  const [localIMLevel, setLocalIMLevel] = useState("");
  const [isLocalIMLevelChosen, setIsLocalIMLevelChosen] = useState(false);

  const [localExcdRate, setLocalExcdRate] = useState("");
  const [isLocalExcdRateChosen, setIsLocalExcdRateChosen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const defaultCausalParams = async () => {
      if (
        (selectedIMType !== null &&
          isLocalIMLevelChosen === true &&
          localIMLevel !== "") ||
        (selectedIMType !== null &&
          isLocalExcdRateChosen === true &&
          localExcdRate !== "")
      ) {
        let queryString = `?ensemble_id=${selectedEnsemble}&station=${station}&IM_j=${selectedIMType}&user_vs30=${vs30}`;
        if (localIMExdRateRadio === "im-level") {
          queryString += `&im_level=${localIMLevel}`;
        } else if (localIMExdRateRadio === "exceedance-rate") {
          queryString += `&exceedance=${localExcdRate}`;
        }
        try {
          const token = await getTokenSilently();
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

              setIsLocalIMLevelChosen(false);
              setIsLocalExcdRateChosen(false);

              // For GMS Viewer, Third Plot
              setGMSMwMin(responseData.mw_low);
              setGMSMwMax(responseData.mw_high);
              setGMSRrupMin(
                renderSigfigs(responseData.rrup_low, CONSTANTS.APP_UI_SIGFIGS)
              );
              setGMSRrupMax(
                renderSigfigs(responseData.rrup_high, CONSTANTS.APP_UI_SIGFIGS)
              );
              // For GMS Viewer, Fourth Plot
              setGMSVS30Min(
                renderSigfigs(responseData.vs30_low, CONSTANTS.APP_UI_SIGFIGS)
              );
              setGMSVS30Max(
                renderSigfigs(responseData.vs30_high, CONSTANTS.APP_UI_SIGFIGS)
              );
            })
            .catch(function (error) {
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
  }, [selectedIMType, isLocalIMLevelChosen, isLocalExcdRateChosen]);

  /*
    IM Vector Section
  */
  const [localIMVector, setLocalIMVector] = useState([]);
  const [isIMVectorChosen, setIsIMVectorChosen] = useState(false);

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

  /*
    Fetch data from Core API -> To get a default weight for each IM Vector.
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const defaultIMWeights = async () => {
      if (localIMVector.length !== 0 && isIMVectorChosen === true) {
        let queryString = `?IM_j=${selectedIMType}&IMs=`;

        // Create a new array from an object.
        // As localIMVector is an object with properties of label and value
        const newIMVector = Array.from(localIMVector, (x) => x.value);

        // To make a string from a sorted array and separate with comma
        orderIMs(newIMVector).forEach((IM) => (queryString += IM + ","));
        // Remove the last comma
        queryString = queryString.slice(0, -1);

        try {
          const token = await getTokenSilently();
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
              setIsIMVectorChosen(false);
            })
            .catch(function (error) {
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
  }, [isIMVectorChosen]);

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
          <span>GMS</span>
        </div>

        <div className="custom-form-group">
          <IMSelect
            title="IM Type"
            setIM={setSelectedIMType}
            options={availableIMs}
          />
        </div>

        <div className="form-group">
          <label
            id="label-im-level"
            htmlFor="im-level"
            className="control-label"
          >
            IM Level/Exceedance Rate
          </label>
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
                IM Level
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
              onFocus={() => setIsLocalIMLevelChosen(false)}
              onBlur={() => setIsLocalIMLevelChosen(true)}
              onChange={(e) => setLocalIMLevel(e.target.value)}
              className="form-control"
              value={localIMLevel}
              onKeyPress={(e) => preventEnterKey(e)}
            />
          ) : (
            <input
              id="exceedance-rate"
              type="number"
              onFocus={() => setIsLocalExcdRateChosen(false)}
              onBlur={() => setIsLocalExcdRateChosen(true)}
              onChange={(e) => setLocalExcdRate(e.target.value)}
              className="form-control"
              value={localExcdRate}
              onKeyPress={(e) => preventEnterKey(e)}
            />
          )}
        </div>

        <div className="custom-form-group">
          <pre>IM Vector</pre>
          <Select
            id="im-vector"
            closeMenuOnSelect={false}
            onMenuOpen={() => setIsIMVectorChosen(false)}
            onMenuClose={() => setIsIMVectorChosen(true)}
            components={animatedComponents}
            isMulti
            onChange={(value) => setLocalIMVector(value || [])}
            options={localIMs.filter((e) => {
              return e.value !== selectedIMType;
            })}
            isDisabled={localIMs.length === 0}
          />
        </div>

        <div className="form-group">
          <label id="label-num-gms" htmlFor="num-gms" className="control-label">
            Num Ground Motions
          </label>
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
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              onClick={() => setArrow(!arrow)}
            >
              <div className="advanced-toggle-header">
                <span>Advanced</span>
                {arrowSets[arrow]}
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <div className="form-group">
                  <label
                    id="label-causal-parameters"
                    htmlFor="causal-parameters"
                    className="control-label"
                  >
                    Pre-GM Filtering Parameters
                  </label>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th className="text-center" scope="col">
                          Min
                        </th>
                        <th className="text-center" scope="col">
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
                            onFocus={() => setIsLocalMwMinChosen(false)}
                            onBlur={() => setIsLocalMwMinChosen(true)}
                            onChange={(e) => setLocalMwMin(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localMwMax}
                            onFocus={() => setIsLocalMwMaxChosen(false)}
                            onBlur={() => setIsLocalMwMaxChosen(true)}
                            onChange={(e) => setLocalMwMax(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Rrup</th>
                        <td>
                          <input
                            type="text"
                            value={localRrupMin}
                            onFocus={() => setIsLocalRrupMinChosen(false)}
                            onBlur={() => setIsLocalRrupMinChosen(true)}
                            onChange={(e) => setLocalRrupMin(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localRrupMax}
                            onFocus={() => setIsLocalRrupMaxChosen(false)}
                            onBlur={() => setIsLocalRrupMaxChosen(true)}
                            onChange={(e) => setLocalRrupMax(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">VS30</th>
                        <td>
                          <input
                            type="text"
                            value={localVS30Min}
                            onFocus={() => setIsLocalVS30MinChosen(false)}
                            onBlur={() => setIsLocalVS30MinChosen(true)}
                            onChange={(e) => setLocalVS30Min(e.target.value)}
                            onKeyPress={(e) => preventEnterKey(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localVS30Max}
                            onFocus={() => setIsLocalVS30MaxChosen(false)}
                            onBlur={() => setIsLocalVS30MaxChosen(true)}
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
                  <pre>Database</pre>
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
