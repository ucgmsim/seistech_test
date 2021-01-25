import React from "react";
import Plot from "react-plotly.js";
import "assets/style/HazardPlots.css";
import { getPlotData } from "utils/Utils";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

const HazardBranchPlot = ({
  hazardData,
  im,
  nzCodeData,
  showNZCode = true,
  extra,
}) => {
  if (
    hazardData !== null &&
    !hazardData.hasOwnProperty("error") &&
    nzCodeData !== null
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

    // Add the scatter object for the ensemble total
    const ensHazard = hazardData["ensemble_hazard"];
    const ensTotalData = getPlotData(ensHazard["total"]);
    scatterObjs.push({
      x: ensTotalData.index,
      y: ensTotalData.values,
      type: "scatter",
      mode: "lines",
      line: { color: "black" },
      name: "Ensemble mean",
    });

    // For NZS1170.5
    const nzCode = getPlotData(nzCodeData);

    scatterObjs.push(
      // NZ Code
      {
        x: nzCode.values,
        y: nzCode.index,
        type: "scatter",
        mode: "lines+markers",
        name: "NZS1170.5",
        marker: { symbol: "triangle-up" },
        line: { color: "black", dash: "dot" },
        visible: showNZCode,
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
