import React from "react";
import Plot from "react-plotly.js";
import "assets/style/HazardPlots.css";
import { getPlotData } from "utils/Utils";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

const HazardBranchPlot = ({ hazardData, im, lat, lng }) => {
  if (hazardData !== null && !hazardData.hasOwnProperty("error")) {
    const branchHazard = hazardData["branches_hazard"];
    // // Create the scatter objects for the branch totals
    const scatterObjs = [];
    for (let [curName, curData] of Object.entries(branchHazard)) {
      let curPlotData = getPlotData(curData["total"]);
      scatterObjs.push({
        x: curPlotData.index,
        y: curPlotData.values,
        type: "scatter",
        mode: "lines",
        line: { color: "gray", width: 0.5 },
        name: curName,
      });
    }

    // // For NZ Code
    const nzCode = getPlotData(hazardData["nz_code_hazard"].im_values);

    // Add the scatter object for the ensemble total
    const ensHazard = hazardData["ensemble_hazard"];
    const ensTotalData = getPlotData(ensHazard["total"]);
    scatterObjs.push({
      x: ensTotalData.index,
      y: ensTotalData.values,
      type: "scatter",
      mode: "lines",
      line: { color: "black" },
      name: "Ensemble total",
    });

    scatterObjs.push(
      // NZ Code
      {
        x: nzCode.values,
        y: nzCode.index,
        type: "scatter",
        mode: "lines+markers",
        name: "NZ code",
        marker: { symbol: "triangle-up" },
        line: { color: "black", dash: "dot" },
      }
    );
    return (
      <Plot
        className={"hazard-plot"}
        data={scatterObjs}
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
            filename: `Branches_Hazard_Plot_${im}_Lat_${String(
              parseFloat(lat).toFixed(4)
            ).replace(".", "p")}_Lng_${String(
              parseFloat(lng).toFixed(4)
            ).replace(".", "p")}`,
          },
        }}
      />
    );
  }
  return <ErrorMessage />;
};

export default HazardBranchPlot;
