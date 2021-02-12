import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG, GMS_LABELS } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";
import { range } from "utils/Utils";

import "assets/style/GMSPlot.css";

const GMSViewerCausalParameters = ({
  gmsData,
  metadata,
  causalParamBounds,
}) => {
  if (
    gmsData !== null &&
    !gmsData.hasOwnProperty("error") &&
    metadata !== undefined
  ) {
    // Sort metadata then duplicate each element
    const xRange = gmsData["metadata"][metadata]
      .sort((a, b) => {
        return a - b;
      })
      .flatMap((x) => Array(2).fill(x));

    // Create an array with range 0 and 1 with third argument as step
    const rangeY = range(0, 1, 1 / gmsData["metadata"][metadata].length);

    // Then we duplicate each element that is not the first and last index's element
    const newRangeY = rangeY.flatMap((x, i) =>
      Array(i === 0 || i === rangeY.length - 1 ? 1 : 2).fill(x)
    );

    // Y coordiates for bounds
    const boundsRangeY = [0, 1];

    // X-axis range - Default
    let xAxisRange = [Math.min(...xRange) * 0.9, Math.max(...xRange) * 1.1];

    const scattersArray = [
      {
        x: xRange,
        y: newRangeY,
        mode: "lines+markers",
        name:
          GMS_LABELS[metadata] === "Vs30"
            ? "Selected GMs"
            : `${GMS_LABELS[metadata]}`,
        line: { shape: "hv", color: "black" },
        type: "scatter",
        showlegend: true,
      },
    ];

    // If selected metadata is not sf, we add bounds (Min / Max)
    if (metadata !== "sf") {
      scattersArray.push(
        {
          x: [
            causalParamBounds[metadata]["min"],
            causalParamBounds[metadata]["min"],
          ],
          y: boundsRangeY,
          legendgroup: metadata,
          name: "Bounds",
          mode: "lines",
          line: { color: "red", dash: "dot" },
          type: "scatter",
        },
        {
          x: [
            causalParamBounds[metadata]["max"],
            causalParamBounds[metadata]["max"],
          ],
          y: boundsRangeY,
          legendgroup: metadata,
          name: "Bounds",
          mode: "lines",
          line: { color: "red", dash: "dot" },
          type: "scatter",
          showlegend: false,
        }
      );

      // If selected metadata is Vs30, not only the min and max bounds, we also add solid line with vs30 value from site selection
      if (metadata === "vs30") {
        scattersArray.push({
          x: [
            causalParamBounds[metadata]["vs30"],
            causalParamBounds[metadata]["vs30"],
          ],
          y: boundsRangeY,
          legendgroup: metadata,
          name: "Site-Specific Vs30",
          mode: "lines",
          line: { color: "red" },
          type: "scatter",
        });
      }

      xAxisRange = [
        Math.min(...xRange, causalParamBounds[metadata]["min"]) * 0.9,
        Math.max(...xRange, causalParamBounds[metadata]["max"]) * 1.1,
      ];
    } else if (metadata === "sf") {
      // Selected metadata is sf, add a solid red line at x=1 as a reference point
      scattersArray.push({
        x: [1, 1],
        y: boundsRangeY,
        name: "Reference Point",
        mode: "lines",
        line: { color: "red" },
        type: "scatter",
      });
    }

    return (
      <Plot
        className={"fourth-plot"}
        data={scattersArray}
        layout={{
          xaxis: {
            title: { text: `${GMS_LABELS[metadata]} distribution` },
            range: xAxisRange,
          },
          yaxis: {
            title: { text: "Cumulative probability, CDF" },
            autorange: true,
          },
          autosize: true,
          margin: PLOT_MARGIN,
        }}
        useResizeHandler={true}
        config={PLOT_CONFIG}
      />
    );
  }
  return <ErrorMessage />;
};

export default GMSViewerCausalParameters;
