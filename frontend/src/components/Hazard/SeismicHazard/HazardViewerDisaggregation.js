import React, { Fragment, useState, useEffect, useContext } from "react";

import { Tabs, Tab } from "react-bootstrap";
import $ from "jquery";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";

import {
  LoadingSpinner,
  DownloadButton,
  GuideMessage,
  ErrorMessage,
  ContributionTable,
} from "components/common";
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
    disaggComputeClick,
    setDisaggComputeClick,
    vs30,
    defaultVS30,
    station,
    selectedIM,
    selectedEnsemble,
    disaggAnnualProb,
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
    Reset tabs if users change IM or Vs30
  */
  useEffect(() => {
    setShowSpinnerDisaggEpsilon(false);
    setShowPlotDisaggEpsilon(false);

    setShowSpinnerDisaggFault(false);
    setShowPlotDisaggFault(false);

    setShowContribTable(false);
    setShowSpinnerContribTable(false);

    setDisaggComputeClick(null);
  }, [selectedIM, vs30]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getHazardData = async () => {
      if (disaggComputeClick !== null) {
        try {
          const token = await getTokenSilently();
          setShowErrorMessage({ isError: false, errorCode: null });

          setShowSpinnerDisaggEpsilon(true);

          setShowSpinnerDisaggFault(true);

          setShowPlotDisaggEpsilon(false);
          setShowPlotDisaggFault(false);

          setShowContribTable(false);
          setShowSpinnerContribTable(true);

          let queryString = `?ensemble_id=${selectedEnsemble}&station=${station}&im=${selectedIM}&exceedance=${disaggAnnualProb}&gmt_plot=True`;

          if (vs30 !== defaultVS30) {
            queryString += `&vs30=${vs30}`;
          }

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.CORE_API_HAZARD_DISAGG_ENDPOINT +
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

              setDownloadToken(responseData["download_token"]);

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
  }, [disaggComputeClick]);

  return (
    <div className="disaggregation-viewer">
      <Tabs defaultActiveKey="epsilon" className="pivot-tabs">
        <Tab eventKey="epsilon" title="Epsilon">
          {disaggComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.DISAGGREGATION}
              body={CONSTANTS.DISAGGREGATION_GUIDE_MSG_PLOT}
              instruction={CONSTANTS.DISAGGREGATION_INSTRUCTION_PLOT}
            />
          )}

          {showSpinnerDisaggEpsilon === true &&
            disaggComputeClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {disaggComputeClick !== null &&
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
          {disaggComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.DISAGGREGATION}
              body={CONSTANTS.DISAGGREGATION_GUIDE_MSG_PLOT}
              instruction={CONSTANTS.DISAGGREGATION_INSTRUCTION_PLOT}
            />
          )}

          {showSpinnerDisaggFault === true &&
            disaggComputeClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {disaggComputeClick !== null &&
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
          {disaggComputeClick === null && (
            <GuideMessage
              header={CONSTANTS.DISAGGREGATION}
              body={CONSTANTS.DISAGGREGATION_GUIDE_MSG_TABLE}
              instruction={CONSTANTS.DISAGGREGATION_INSTRUCTION_TABLE}
            />
          )}

          {showSpinnerContribTable === true &&
            disaggComputeClick !== null &&
            showErrorMessage.isError === false && <LoadingSpinner />}

          {disaggComputeClick !== null &&
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
        downloadURL={CONSTANTS.CORE_API_HAZARD_DISAGG_DOWNLOAD_ENDPOINT}
        downloadToken={{
          disagg_token: downloadToken,
        }}
        extraParams={{
          ensemble_id: selectedEnsemble,
          station: station,
          im: selectedIM,
          exceedance: disaggAnnualProb,
        }}
        fileName="disaggregation.zip"
      />
    </div>
  );
};

export default HazadViewerDisaggregation;
