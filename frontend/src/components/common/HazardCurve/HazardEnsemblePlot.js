import React from "react";
import Plot from "react-plotly.js";
import "assets/style/HazardPlots.css";
import { getPlotData } from "utils/Utils";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import { ErrorMessage } from "components/common";

const HazardEnsemblePlot = ({
  hazardData,
  im,
  nzCodeData,
  showNZCode = true,
  extra,
  hoverStatus,
}) => {
  if (
    hazardData !== null &&
    !hazardData.hasOwnProperty("error") &&
    nzCodeData !== null
  ) {
    const ensHazard = hazardData["ensemble_hazard"];
    const plotData = {};

    for (let typeKey of ["fault", "ds", "total"]) {
      plotData[typeKey] = getPlotData(ensHazard[typeKey]);
    }

    plotData["nzCode"] = getPlotData(nzCodeData);

    return (
      <Plot
        className={"hazard-plot"}
        data={[
          // Fault
          {
            x: plotData.fault.index,
            y: plotData.fault.values,
            type: "scatter",
            mode: "lines",
            name: "Fault",
            line: { color: "red" },
            hoverinfo: "none",
            hovertemplate:
              hoverStatus === true
                ? "<b>Fault</b><br><br>" +
                  "%{xaxis.title.text}: %{x}<br>" +
                  "%{yaxis.title.text}: %{y}<extra></extra>"
                : "",
          },
          // DS
          {
            x: plotData.ds.index,
            y: plotData.ds.values,
            type: "scatter",
            mode: "lines",
            name: "Distributed",
            line: { color: "green" },
            hoverinfo: "none",
            hovertemplate:
              hoverStatus === true
                ? "<b>Distributed</b><br><br>" +
                  "%{xaxis.title.text}: %{x}<br>" +
                  "%{yaxis.title.text}: %{y}<extra></extra>"
                : "",
          },
          // Total
          {
            x: plotData.total.index,
            y: plotData.total.values,
            type: "scatter",
            mode: "lines",
            name: "Total",
            line: { color: "blue" },
            hoverinfo: "none",
            hovertemplate:
              hoverStatus === true
                ? "<b>Total</b><br><br>" +
                  "%{xaxis.title.text}: %{x}<br>" +
                  "%{yaxis.title.text}: %{y}<extra></extra>"
                : "",
          },
          // NZS1170.5
          {
            x: plotData.nzCode.values,
            y: plotData.nzCode.index,
            type: "scatter",
            mode: "lines+markers",
            name: "NZS1170.5",
            marker: { symbol: "triangle-up" },
            line: { color: "black", dash: "dot" },
            visible: showNZCode,
            hoverinfo: "none",
            hovertemplate:
              hoverStatus === true
                ? "<b>NZS1170.5</b><br><br>" +
                  "%{xaxis.title.text}: %{x}<br>" +
                  "%{yaxis.title.text}: %{y}<extra></extra>"
                : "",
          },
        ]}
        layout={{
          xaxis: {
            type: "log",
            title: { text: im },
            showexponent: "first",
            exponentformat: "power",
          },
          yaxis: {
            type: "log",
            title: { text: "Annual rate of exceedance" },
            showexponent: "first",
            exponentformat: "power",
            range: [-5, 0],
          },
          autosize: true,
          margin: PLOT_MARGIN,
          legend: {
            x: 1,
            xanchor: "right",
            y: 1,
          },
          // hovermode to decide how hover works, currently only display the value to the closest point
          hovermode: "closest",
          hoverlabel: { bgcolor: "#FFF" },
        }}
        useResizeHandler={true}
        config={{
          ...PLOT_CONFIG,
          toImageButtonOptions: {
            filename:
              extra.from === "hazard"
                ? `Hazard_Plot_${im}_Lat_${String(
                    parseFloat(extra.lat).toFixed(4)
                  ).replace(".", "p")}_Lng_${String(
                    parseFloat(extra.lng).toFixed(4)
                  ).replace(".", "p")}`
                : `Hazard_Plot_${extra.im}_project_id_${extra.id}_location_${extra.location}_vs30_${extra.vs30}`,
          },
        }}
      />
    );
  }
  return <ErrorMessage />;
};

export default HazardEnsemblePlot;
