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

const UHSPlot = ({
  uhsData,
  nzCodeData,
  showNZCode = true,
  extra,
  hoverStatus,
}) => {
  if (uhsData !== null && !uhsData.hasOwnProperty("error")) {
    const NZCodeLegend = (isNZCode) => {
      const selectedRPs = extra.selectedRPs;
      // Sort the selected RP array first
      selectedRPs.sort((a, b) => a - b);
      // Based on a sorted array, add each RP
      // Depends on the isNZCode status, newLabel starts with NZ Code - or an empty string
      let newLabel =
        isNZCode === true ? "NZS1170.5 [RP = " : "Site-specific [RP = ";

      for (let i = 0; i < selectedRPs.length; i++) {
        newLabel += `${selectedRPs[i].toString()}, `;
      }

      // Remove last two character (, ) and add closing bracket
      newLabel = newLabel.slice(0, -2) + "]";

      return newLabel;
    };

    // Create NZ code UHS scatter objs
    const scatterObjs = [];
    let nzCodeDataCounter = 0;

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
          name: NZCodeLegend(true),
          visible: showNZCode,
          legendgroup: "NZS1170.5",
          showlegend: nzCodeDataCounter === 0 ? true : false,
          hoverinfo: "none",
          hovertemplate:
            hoverStatus === true
              ? `<b>RP ${displayRP}</b><br><br>` +
                "%{xaxis.title.text}: %{x}<br>" +
                "%{yaxis.title.text}: %{y}<extra></extra>"
              : "",
        });
        nzCodeDataCounter += 1;
      }
    }

    // UHS scatter objs
    let dataCounter = 0;
    for (let [curExcd, curData] of Object.entries(uhsData)) {
      let curPlotData = getPlotData(curData);
      let displayRP = (1 / Number(curExcd)).toString();
      scatterObjs.push({
        x: curPlotData.index,
        y: curPlotData.values,
        type: "scatter",
        mode: "lines",
        line: { color: "blue" },
        name: NZCodeLegend(false),
        legendgroup: "sites-specific",
        showlegend: dataCounter === 0 ? true : false,
        hoverinfo: "none",
        hovertemplate:
          hoverStatus === true
            ? `<b>RP ${displayRP}</b><br><br>` +
              "%{xaxis.title.text}: %{x}<br>" +
              "%{yaxis.title.text}: %{y}<extra></extra>"
            : "",
      });
      dataCounter += 1;
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
