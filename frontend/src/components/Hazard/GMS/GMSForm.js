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
import { renderSigfigs, handleErrors } from "utils/Utils";
import "assets/style/GMSForm.css";

const GMSForm = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    vs30,
    IMVectors,
    setComputedGMS,
    setIsLoading,
    setSelectedIMVectors,
  } = useContext(GlobalContext);
  const [localComputeButton, setLocalComputeButton] = useState("Compute");
  const [localComputeClick, setLocalComputeClick] = useState(null);

  const animatedComponents = makeAnimated();

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

  const [arrow, setArrow] = useState(true);

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
              <td>
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
        // To make a string from an array of objects and separate with comma
        localIMVector.forEach((IM) => (queryString += IM.value + ","));
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

  /*
    Fetch data from Core API -> compute_ensemble_GMS
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const computeEnsembleGMS = async () => {
      if (
        localComputeClick !== null &&
        (localIMLevel !== "" || localExcdRate !== "")
      ) {
        try {
          const token = await getTokenSilently();
          setLocalComputeButton(<FontAwesomeIcon icon="spinner" spin />);
          setIsLoading(true);
          const newIMVector = localIMVector.map((vector) => {
            return vector.value;
          });

          let requestOptions = {};

          if (localIMExdRateRadio === "im-level") {
            requestOptions = {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ensemble_id: selectedEnsemble,
                station: station,
                IM_j: selectedIMType,
                IMs: newIMVector,
                n_gms: Number(localNumGMS),
                gm_source_ids: ["nga_west_2"],
                im_level: Number(localIMLevel),
                n_replica: Number(localReplicates),
                IM_weights: localWeights,
              }),
              signal: signal,
            };
          } else if (localIMExdRateRadio === "exceedance-rate") {
            requestOptions = {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ensemble_id: selectedEnsemble,
                station: station,
                IM_j: selectedIMType,
                IMs: newIMVector,
                n_gms: Number(localNumGMS),
                gm_source_ids: ["nga_west_2"],
                exceedance: Number(localExcdRate),
                n_replica: Number(localReplicates),
                IM_weights: localWeights,
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
              setLocalComputeButton("Compute");
              setSelectedIMVectors(newIMVector);
              setIsLoading(false);
              setIsLocalIMLevelChosen(false);
              setIsLocalExcdRateChosen(false);
            })
            .catch(function (error) {
              setLocalComputeButton("Compute");
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
  }, [localComputeClick]);

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
      ((localIMExdRateRadio === "exceedance-rate" && localExcdRate !== "") ||
        (localIMExdRateRadio === "im-level" && localIMLevel !== ""))
    );
  };

  return (
    <Fragment>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group form-section-title">
          <span>GMS</span>
        </div>

        <div className="custom-form-group">
          <IMSelect title="IM Type" setIM={setSelectedIMType} />
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
            options={IMVectors.filter((e) => {
              return e.value !== selectedIMType;
            })}
            isDisabled={IMVectors.length === 0}
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
          />
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary"
            onClick={() => setLocalComputeClick(uuidv4())}
            disabled={!validInputs()}
          >
            {localComputeButton}
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
                            onChange={(e) => setLocalMwMin(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localMwMax}
                            onChange={(e) => setLocalMwMax(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Rrup</th>
                        <td>
                          <input
                            type="text"
                            value={localRrupMin}
                            onChange={(e) => setLocalRrupMin(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localRrupMax}
                            onChange={(e) => setLocalRrupMax(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">VS30</th>
                        <td>
                          <input
                            type="text"
                            value={localVS30Min}
                            onChange={(e) => setLocalVS30Min(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={localVS30Max}
                            onChange={(e) => setLocalVS30Max(e.target.value)}
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
