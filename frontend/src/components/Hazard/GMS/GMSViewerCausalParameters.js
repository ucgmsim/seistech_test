import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";
import { range } from "utils/Utils";

import "assets/style/GMSPlot.css";

const GMSViewerCausalParameters = ({ gmsData, metadata, causalParamBounds }) => {
  if (
    gmsData !== null &&
    !gmsData.hasOwnProperty("error") &&
    metadata !== undefined
  ) {
    const xRange = gmsData["metadata"][metadata]
      .sort((a, b) => {
        return a - b;
      })
      .flatMap((x) => Array(2).fill(x));

    const rangeY = range(0, 1, 1 / gmsData["metadata"][metadata].length);

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
        name: metadata,
        line: { shape: "hv", color: "black" },
        type: "scatter",
        showlegend: true,
      },
    ];

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

      if (metadata === "vs30") {
        scattersArray.push({
          x: [
            causalParamBounds[metadata]["vs30"],
            causalParamBounds[metadata]["vs30"],
          ],
          y: boundsRangeY,
          legendgroup: metadata,
          name: "VS30",
          mode: "lines",
          line: { color: "red" },
          type: "scatter",
        });
      }

      xAxisRange = [
        Math.min(...xRange, causalParamBounds[metadata]["min"]) * 0.9,
        Math.max(...xRange, causalParamBounds[metadata]["max"]) * 1.1,
      ];
    }

    return (
      <Plot
        className={"fourth-plot"}
        data={scattersArray}
        layout={{
          xaxis: {
            title: { text: `Metadata: ${metadata}` },
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
