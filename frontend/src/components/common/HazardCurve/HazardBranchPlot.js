import React from "react";

import Plot from "react-plotly.js";

import { getPlotData } from "utils/Utils";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import { ErrorMessage } from "components/common";

import "assets/style/HazardPlots.css";

const HazardBranchPlot = ({
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

    // For NZS1170P5 code
    const nzs1170p5 = getPlotData(nzs1170p5Data);

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
      // For NZS1170P5 code
      {
        x: nzs1170p5.values,
        y: nzs1170p5.index,
        type: "scatter",
        mode: "lines+markers",
        name: "NZS1170p5",
        marker: { symbol: "triangle-up" },
        line: { color: "black", dash: "dot" },
        visible: showNZS1170p5,
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
          ...PLOT_CONFIG,
          toImageButtonOptions: {
            filename:
              extra.from === "hazard"
                ? `Branches_Hazard_Plot_${im}_Lat_${String(
                    parseFloat(extra.lat).toFixed(4)
                  ).replace(".", "p")}_Lng_${String(
                    parseFloat(extra.lng).toFixed(4)
                  ).replace(".", "p")}`
                : `Branches_Hazard_Plot_${extra.im}_project_id_${extra.id}_location_${extra.location}_vs30_${extra.vs30}`,
          },
        }}
      />
    );
  }
  return <ErrorMessage />;
};

export default HazardBranchPlot;
