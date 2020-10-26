import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const FourthPlot = ({ gmsData, metadata }) => {
  const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step) + 1)
      .fill(start)
      .map((x, y) => x + y * step);

  if (
    gmsData !== null &&
    !gmsData.hasOwnProperty("error") &&
    metadata !== undefined
  ) {
    const xRange = gmsData["metadata"][metadata]
      .flatMap((x) => Array(2).fill(x))
      .sort((a, b) => {
        return a - b;
      });

    const rangeY = range(0, 1, 1 / xRange.length);

    const newRangeY = rangeY.flatMap((x, i) =>
      Array(i === 0 || i === rangeY.length - 1 ? 1 : 2).fill(x)
    );

    return (
      <Plot
        className={"fourth-plot"}
        data={[
          {
            x: xRange,
            y: newRangeY,
            mode: "lines+markers",
            name: "Magnitude",
            line: { shape: "hv", color: "black" },
            type: "scatter",
          },
        ]}
        layout={{
          xaxis: {
            title: { text: "Metadata" },
          },
          yaxis: {
            title: { text: "0 to 1" },
          },
          autosize: true,
          margin: PLOT_MARGIN,
        }}
        useResizeHandler={true}
        config={{ displayModeBar: true }}
      />
    );
  }
  return <ErrorMessage />;
};

export default FourthPlot;
