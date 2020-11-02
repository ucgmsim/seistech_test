import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";
import { range } from "utils/Utils";

import "assets/style/GMSPlot.css";

const FirstPlot = ({ gmsData, IM }) => {
  if (
    gmsData !== null &&
    !gmsData.hasOwnProperty("error") &&
    IM !== undefined
  ) {
    const cdfX = gmsData["gcim_cdf_x"][IM];
    const cdfY = gmsData["gcim_cdf_y"][IM];
    const realisations = gmsData["realisations"][IM];
    const selectedGMs = gmsData["selected_GMs"][IM];
    const ksBounds = gmsData["ks_bounds"];

    const upperBounds = Array.from(cdfY, (x) => x + ksBounds);
    const lowerBounds = Array.from(cdfY, (x) => x - ksBounds);

    // double the elements
    const newRealisations = realisations
      .sort((a, b) => {
        return a - b;
      })
      .flatMap((x) => Array(2).fill(x));

    // double the elements
    const newSelectedGMs = selectedGMs
      .sort((a, b) => {
        return a - b;
      })
      .flatMap((x) => Array(2).fill(x));

    // Create an array for Y axis
    const rangeY = range(0, 1, 1 / realisations.length);

    const newRangeY = rangeY.flatMap((x, i) =>
      Array(i === 0 || i === rangeY.length - 1 ? 1 : 2).fill(x)
    );

    return (
      <Plot
        className={"specific-im-plot"}
        data={[
          {
            x: cdfX,
            y: cdfY,
            mode: "lines",
            name: "GCIM",
            line: { shape: "hv", color: "red" },
            type: "scatter",
          },
          {
            x: cdfX,
            y: upperBounds,
            mode: "lines",
            name: "KS bounds",
            legendgroup: "KS bounds",
            line: { dash: "dashdot", shape: "hv", color: "red" },
            type: "scatter",
          },
          {
            x: cdfX,
            y: lowerBounds,
            mode: "lines",
            name: "KS bounds",
            legendgroup: "KS bounds",
            line: { dash: "dashdot", shape: "hv", color: "red" },
            type: "scatter",
            showlegend: false,
          },
          {
            x: newRealisations,
            y: newRangeY,
            mode: "lines",
            name: "Realisations",
            line: { shape: "hv", color: "black" },
            type: "scatter",
          },
          {
            x: newSelectedGMs,
            y: newRangeY,
            mode: "lines",
            name: "GMs",
            line: { shape: "hv", color: "blue" },
            type: "scatter",
          },
        ]}
        layout={{
          xaxis: {
            title: { text: "Peak ground velocity, PGV (cm/s)" },
            rangemode: "tozero",
            autorange: true,
          },
          yaxis: {
            title: { text: "Cumulative probability, CDF" },
            range: [0, 1],
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

export default FirstPlot;
