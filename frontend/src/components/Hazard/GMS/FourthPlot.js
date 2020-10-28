import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";
import { range } from "utils/Utils";

import "assets/style/GMSPlot.css";

const FourthPlot = ({ gmsData, metadata }) => {
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
            title: { text: `Metadata: ${metadata}` },
          },
          yaxis: {
            title: { text: "0 to 1" },
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

export default FourthPlot;
