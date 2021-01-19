import React from "react";
import Plot from "react-plotly.js";
import { getPlotData, renderSigfigs } from "utils/Utils.js";
import {
  PLOT_MARGIN,
  PLOT_CONFIG,
  APP_UI_SIGFIGS,
  APP_UI_UHS_RATETABLE_RATE_SIGFIGS,
} from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/UHSPlot.css";

const UHSPlot = ({ uhsData, nzCodeData, showNZCode = true, extra }) => {
  if (uhsData !== null && !uhsData.hasOwnProperty("error")) {
    // Create NZ code UHS scatter objs
    const scatterObjs = [];
    for (let [curExcd, curData] of Object.entries(nzCodeData)) {
      // The object contains the value of NaN, so we dont plot
      if (Object.values(curData).includes("nan")) {
        continue;
        // Else we plot
      } else {
        let curPlotData = getPlotData(curData);
        // Convert the Annual exdance reate to Return period in a string format
        let displayRP = (1 / Number(curExcd)).toString();
        scatterObjs.push({
          x: curPlotData.index,
          y: curPlotData.values,
          type: "scatter",
          mode: "lines",
          line: { color: "black" },
          name:
            // Then if the string contains `.` means it's in float/decimal that needs to display in 4SF for RP, 3SF for rate
            // Else, print what it is as it is an integer.
            // E.g., "14".indexOf(".") returns -1 as it does not have "." in it
            displayRP.indexOf(".") == -1
              ? `NZ Code - RP ${Number(displayRP)} - ${renderSigfigs(
                  Number(1 / displayRP),
                  APP_UI_UHS_RATETABLE_RATE_SIGFIGS
                )}`
              : `NZ Code - RP ${renderSigfigs(
                  Number(displayRP),
                  APP_UI_SIGFIGS
                )} - ${renderSigfigs(
                  Number(1 / displayRP),
                  APP_UI_UHS_RATETABLE_RATE_SIGFIGS
                )}`,
          visible: showNZCode,
        });
      }
    }

    // UHS scatter objs
    for (let [curExcd, curData] of Object.entries(uhsData)) {
      let curPlotData = getPlotData(curData);
      let displayRP = (1 / Number(curExcd)).toString();
      scatterObjs.push({
        x: curPlotData.index,
        y: curPlotData.values,
        type: "scatter",
        mode: "lines",
        line: { color: "blue" },
        name:
          displayRP.indexOf(".") == -1
            ? `RP ${Number(displayRP)} - ${renderSigfigs(
                Number(1 / displayRP),
                APP_UI_UHS_RATETABLE_RATE_SIGFIGS
              )} `
            : `RP ${renderSigfigs(
                1 / Number(curExcd),
                APP_UI_SIGFIGS
              )} - ${renderSigfigs(
                Number(1 / displayRP),
                APP_UI_UHS_RATETABLE_RATE_SIGFIGS
              )}`,
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
          ...PLOT_CONFIG,
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
