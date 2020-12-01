import React from "react";
import Plot from "react-plotly.js";
import { getPlotData } from "utils/Utils.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/UHSPlot.css";

const UHSPlot = ({ uhsData, nzCodeData, extra }) => {
  if (uhsData !== null && !uhsData.hasOwnProperty("error")) {
    // Create NZ code UHS scatter objs
    const scatterObjs = [];
    for (let [curExcd, curData] of Object.entries(nzCodeData)) {
      let curPlotData = getPlotData(curData);
      scatterObjs.push({
        x: curPlotData.index,
        y: curPlotData.values,
        type: "scatter",
        mode: "lines",
        line: { color: "black" },
        name: `NZ Code - ${curExcd}`,
      });
    }

    // UHS scatter objs
    for (let [curExcd, curData] of Object.entries(uhsData["uhs_df"])) {
      let curPlotData = getPlotData(curData);
      scatterObjs.push({
        x: curPlotData.index,
        y: curPlotData.values,
        type: "scatter",
        mode: "lines",
        line: { color: "blue" },
        name: `${curExcd}`,
      });
    }

    return (
      <Plot
        className={"hazard-plot uhs-plot"}
        data={scatterObjs}
        layout={{
          xaxis: {
            title: { text: "SA Period (s)" },
          },
          yaxis: {
            title: { text: "SA (g)" },
          },
          autosize: true,
          margin: PLOT_MARGIN,
        }}
        useResizeHandler={true}
        config={{
          displayModeBar: true,
          toImageButtonOptions: {
            filename:
              extra.from === "hazard"
                ? `UHS_Plot_Lat_${String(
                    parseFloat(extra.lat).toFixed(4)
                  ).replace(".", "p")}_Lng_${String(
                    parseFloat(extra.lng).toFixed(4)
                  ).replace(".", "p")}`
                : `UHS_Plot_project_id_${extra.id}_location_${extra.location}_vs30_${extra.vs30}`,
          },
        }}
      />
    );
  }
  return <ErrorMessage />;
};

export default UHSPlot;
