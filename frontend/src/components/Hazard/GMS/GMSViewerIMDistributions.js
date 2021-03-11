import React from "react";

import Plot from "react-plotly.js";

import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import { range } from "utils/Utils";

import "assets/style/GMSPlot.css";

const GMSViewerIMDistributions = ({ gmsData, IM }) => {
  console.log("OW IM HERE~~~~ IM DISTRIBUTION")
  const cdfX = gmsData["gcim_cdf_x"][IM];
  const cdfY = gmsData["gcim_cdf_y"][IM];
  const realisations = gmsData["realisations"][IM];
  const selectedGMs = gmsData["selected_GMs"][IM];
  const ksBounds = gmsData["ks_bounds"];

  // GCIM + KS Bounds
  const upperBounds = Array.from(cdfY, (x) => x + ksBounds);
  // Find the the y value that is bigger than 1.
  const yLimitAtOne = upperBounds.find((element) => element > 1);
  // This is the upper limit and slice does not include it, so no need to subtract 1 index
  const yLimitAtOneIndex = upperBounds.indexOf(yLimitAtOne);

  // GCIM - KS Bounds
  const lowerBounds = Array.from(cdfY, (x) => x - ksBounds);
  // Find the the y value that is bigger than or equal to 0
  const yLimitAtZero = lowerBounds.find((element) => element >= 0);
  const yLimitAtZeroIndex = lowerBounds.indexOf(yLimitAtZero);

  // sort & duplicate the elements
  const newRealisations = realisations
    .sort((a, b) => {
      return a - b;
    })
    .flatMap((x) => Array(2).fill(x));

  // sort & duplicate the elements
  const newSelectedGMs = selectedGMs
    .sort((a, b) => {
      return a - b;
    })
    .flatMap((x) => Array(2).fill(x));

  // Create an array for Y axis
  const rangeY = range(0, 1, 1 / realisations.length);

  // Double the elements except the first and the last element
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
          x: cdfX.slice(0, yLimitAtOneIndex),
          y: upperBounds.slice(0, yLimitAtOneIndex),
          mode: "lines",
          name: "KS bounds",
          legendgroup: "KS bounds",
          line: { dash: "dashdot", shape: "hv", color: "red" },
          type: "scatter",
        },
        {
          x: cdfX.slice(yLimitAtZeroIndex),
          y: lowerBounds.slice(yLimitAtZeroIndex),
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
};

export default GMSViewerIMDistributions;
