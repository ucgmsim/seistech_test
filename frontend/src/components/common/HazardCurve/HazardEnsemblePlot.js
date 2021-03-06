import React from "react";

import Plot from "react-plotly.js";

import { getPlotData } from "utils/Utils";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import { ErrorMessage } from "components/common";

import "assets/style/HazardPlots.css";

const HazardEnsemblePlot = ({
  hazardData,
  im,
  nzs1170p5Data,
  showNZS1170p5 = true,
  extra,
}) => {
  if (
    hazardData !== null &&
    !hazardData.hasOwnProperty("error") &&
    nzs1170p5Data !== null
  ) {
    const ensHazard = hazardData["ensemble_hazard"];
    const plotData = {};

    for (let typeKey of ["fault", "ds", "total"]) {
      plotData[typeKey] = getPlotData(ensHazard[typeKey]);
    }

    plotData["nzs1170p5"] = getPlotData(nzs1170p5Data);

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
          // NZS1170P5 code
          {
            x: plotData.nzs1170p5.values,
            y: plotData.nzs1170p5.index,
            type: "scatter",
            mode: "lines+markers",
            name: "NZS1170p5 code",
            marker: { symbol: "triangle-up" },
            line: { color: "black", dash: "dot" },
            visible: showNZS1170p5,
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
