import React from "react";
import Plot from "react-plotly.js";
import "assets/style/HazardPlots.css";
import { getPlotData } from "utils/Utils";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

const HazardEnsemblePlot = ({ hazardData, im, station }) => {
  if (hazardData !== null && !hazardData.hasOwnProperty("error")) {
    const ensHazard = hazardData["ensemble_hazard"];

    const plotData = {};
    for (let typeKey of ["fault", "ds", "total"]) {
      plotData[typeKey] = getPlotData(ensHazard[typeKey]);
    }
    plotData["nzCode"] = getPlotData(hazardData["nz_code_hazard"].im_values);

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
          },
          // DS
          {
            x: plotData.ds.index,
            y: plotData.ds.values,
            type: "scatter",
            mode: "lines",
            name: "Distributed",
            line: { color: "green" },
          },
          // Total
          {
            x: plotData.total.index,
            y: plotData.total.values,
            type: "scatter",
            mode: "lines",
            name: "Total",
            line: { color: "blue" },
          },
          // NZ code
          {
            x: plotData.nzCode.values,
            y: plotData.nzCode.index,
            type: "scatter",
            mode: "lines+markers",
            name: "NZ code",
            marker: { symbol: "triangle-up" },
            line: { color: "black", dash: "dot" },
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
        }}
        useResizeHandler={true}
        config={{
          displayModeBar: true,
          toImageButtonOptions: {
            filename: `Hazard_Plot_${im}_${station}`,
          },
        }}
      />
    );
  }
  return <ErrorMessage />;
};

export default HazardEnsemblePlot;
