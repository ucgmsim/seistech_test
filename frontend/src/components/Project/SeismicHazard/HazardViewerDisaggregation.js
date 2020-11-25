import React, { useState, useEffect, useContext } from "react";
import { Fragment } from "react";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { Tabs, Tab } from "react-bootstrap";
import $ from "jquery";

import LoadingSpinner from "components/common/LoadingSpinner";
import DownloadButton from "components/common/DownloadButton";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";

import { GlobalContext } from "context";
import ContributionTable from "./ContributionTable";
import { handleErrors } from "utils/Utils";

const HazadViewerDisaggregation = () => {
  const { getTokenSilently } = useAuth0();

  const [showSpinnerDisaggFault, setShowSpinnerDisaggFault] = useState(false);
  const [showSpinnerDisaggEpsilon, setShowSpinnerDisaggEpsilon] = useState(
    false
  );
  const [showSpinnerContribTable, setShowSpinnerContribTable] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState({
    isError: false,
    errorCode: null,
  });

  const [showPlotDisaggEpsilon, setShowPlotDisaggEpsilon] = useState(false);
  const [showPlotDisaggFault, setShowPlotDisaggFault] = useState(false);
  const [showContribTable, setShowContribTable] = useState(false);

  const [disaggTotalContr, setDisaggTotalContr] = useState(null);

  const [downloadToken, setDownloadToken] = useState("");

  const [disaggPlotData, setDisaggPlotData] = useState({
    eps: null,
    src: null,
  });

  const {
    projectDisaggGetClick,
    setProjectDisaggGetClick,
    projectId,
    projectVS30,
    projectLocation,
    projectLocationCode,
    projectSelectedIM,
    projectSelectedDisagRP,
  } = useContext(GlobalContext);

  const [rowsToggled, setRowsToggled] = useState(true);

  const [toggleText, setToggleText] = useState("Show More...");

  const rowToggle = () => {
    setRowsToggled(!rowsToggled);

    if (rowsToggled) {
      $("tr.contrib-toggle-row.contrib-row-hidden").removeClass(
        "contrib-row-hidden"
      );
      $("tr.contrib-ellipsis td").addClass("hidden");
    } else {
      $("tr.contrib-toggle-row").addClass("contrib-row-hidden");
      $("tr.contrib-ellipsis td.hidden").removeClass("hidden");
    }

    setToggleText(rowsToggled ? "Show Less..." : "Show More...");
  };

  /*
    Reset tabs if users change IM
  */
  useEffect(() => {
    setShowSpinnerDisaggEpsilon(false);
    setShowPlotDisaggEpsilon(false);

    setShowSpinnerDisaggFault(false);
    setShowPlotDisaggFault(false);

    setShowContribTable(false);
    setShowSpinnerContribTable(false);

    setProjectDisaggGetClick(null);
  }, [projectSelectedIM]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getHazardData = async () => {
      console.log("AM IHERE?")
      if (projectDisaggGetClick !== null) {
        console.log("WHATS GOING ON!?")
        try {
          const token = await getTokenSilently();
          setShowErrorMessage({ isError: false, errorCode: null });

          setShowSpinnerDisaggEpsilon(true);

          setShowSpinnerDisaggFault(true);

          setShowPlotDisaggEpsilon(false);
          setShowPlotDisaggFault(false);

          setShowContribTable(false);
          setShowSpinnerContribTable(true);

          let queryString = `?project_id=${projectId}&station_id=${projectLocationCode[projectLocation]}_${projectVS30}&im=${projectSelectedIM}&rp=${projectSelectedDisagRP}`;

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_ROUTE_PROJECT_DISAGG_GET +
              queryString,
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

              // setDownloadToken(responseData["download_token"]);

              setShowSpinnerDisaggEpsilon(false);

              const srcDisaggPlot = responseData["gmt_plot_src"];
              const epsDisaggPlot = responseData["gmt_plot_eps"];

              setDisaggPlotData({
                src: srcDisaggPlot,
                eps: epsDisaggPlot,
              });

              setShowSpinnerDisaggEpsilon(false);

              setShowSpinnerDisaggFault(false);

              setShowSpinnerContribTable(false);

              setShowPlotDisaggEpsilon(true);

              setShowPlotDisaggFault(true);

              setShowContribTable(true);

              const disaggTotalData =
                responseData["disagg_data"]["total_contribution"];

              const extraInfo = responseData["extra_info"];
              try {
                extraInfo.rupture_name["distributed_seismicity"] =
                  "Distributed Seismicity";
              } catch (err) {
                console.log(err.message);
              }

              const data = Array.from(Object.keys(disaggTotalData), (key) => {
                return [
                  key,
                  extraInfo.rupture_name[key],
                  disaggTotalData[key],
                  extraInfo.annual_rec_prob[key],
                  extraInfo.magnitude[key],
                  extraInfo.rrup[key],
                ];
              });

              data.sort((entry1, entry2) => {
                return entry1[2] > entry2[2] ? -1 : 1;
              });

              setDisaggTotalContr(data);
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                setShowSpinnerContribTable(false);
                setShowSpinnerDisaggEpsilon(false);
                setShowSpinnerDisaggFault(false);

                setShowErrorMessage({ isError: true, errorCode: error });
              }

              console.log(error);
            });
        } catch (error) {
          setShowSpinnerContribTable(false);
          setShowSpinnerDisaggEpsilon(false);
          setShowSpinnerDisaggFault(false);

          setShowErrorMessage({ isError: true, errorCode: error });
          console.log(error);
        }
      }
    };
    getHazardData();

    return () => {
      abortController.abort();
    };
  }, [projectDisaggGetClick]);

  return (
    <div className="disaggregation-viewer">
      <Tabs defaultActiveKey="epsilon" className="pivot-tabs">
        <Tab eventKey="epsilon" title="Epsilon">
          {projectDisaggGetClick === null && (
            <GuideMessage
              header={CONSTANTS.DISAGGREGATION}
              body={CONSTANTS.DISAGGREGATION_WARNING_MSG_PLOT}
              instruction={CONSTANTS.DISAGGREGATION_INSTRUCTION_PLOT}
            />
          )}

          {showSpinnerDisaggEpsilon === true &&
            projectDisaggGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectDisaggGetClick !== null &&
            showSpinnerDisaggEpsilon === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinnerDisaggEpsilon === false &&
            showPlotDisaggEpsilon === true &&
            showErrorMessage.isError === false && (
              <Fragment>
                <img
                  className="img-fluid rounded mx-auto d-block"
                  src={`data:image/png;base64,${disaggPlotData.eps}`}
                  alt="Epsilon disagg plot"
                />
              </Fragment>
            )}
        </Tab>

        <Tab eventKey="fault" title="Fault/distributed seismicity">
          {projectDisaggGetClick === null && (
            <GuideMessage
              header={CONSTANTS.DISAGGREGATION}
              body={CONSTANTS.DISAGGREGATION_WARNING_MSG_PLOT}
              instruction={CONSTANTS.DISAGGREGATION_INSTRUCTION_PLOT}
            />
          )}

          {showSpinnerDisaggFault === true &&
            projectDisaggGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectDisaggGetClick !== null &&
            showSpinnerDisaggFault === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinnerDisaggFault === false &&
            showPlotDisaggFault === true &&
            showErrorMessage.isError === false && (
              <Fragment>
                <img
                  className="img-fluid rounded mx-auto d-block"
                  src={`data:image/png;base64,${disaggPlotData.src}`}
                  alt="Source disagg plot"
                />
              </Fragment>
            )}
        </Tab>

        <Tab eventKey="contributions" title="Source contributions">
          {projectDisaggGetClick === null && (
            <GuideMessage
              header={CONSTANTS.DISAGGREGATION}
              body={CONSTANTS.DISAGGREGATION_WARNING_MSG_TABLE}
              instruction={CONSTANTS.DISAGGREGATION_INSTRUCTION_TABLE}
            />
          )}

          {showSpinnerContribTable === true &&
            projectDisaggGetClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {projectDisaggGetClick !== null &&
            showSpinnerContribTable === false &&
            showErrorMessage.isError === true && (
              <ErrorMessage errorCode={showErrorMessage.errorCode} />
            )}

          {showSpinnerContribTable === false &&
            showContribTable === true &&
            showErrorMessage.isError === false && (
              <Fragment>
                <ContributionTable disaggData={disaggTotalContr} />
                <button
                  className="btn btn-info hazard-disagg-contrib-button"
                  onClick={rowToggle}
                >
                  {toggleText}
                </button>
              </Fragment>
            )}
        </Tab>
      </Tabs>
      <DownloadButton
        disabled={!showContribTable}
        downloadURL={CONSTANTS.INTE_API_DOWNLOAD_DISAGG}
        downloadToken={downloadToken}
        fileName="disaggregation.zip"
      />
    </div>
  );
};

export default HazadViewerDisaggregation;
