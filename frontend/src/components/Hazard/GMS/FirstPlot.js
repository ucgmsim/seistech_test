import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

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

    // Create an array from N to 1.
    const realisationsRangeY = Array.from(
      { length: realisations.length },
      (_, index) => index + 1
    );
    // Range from 1/N to 1
    realisationsRangeY.forEach(
      (y, index, realisationsRangeY) =>
        (realisationsRangeY[index] = y / realisations.length)
    );

    // Create an array from N to 1.
    const selectedGMsRangeY = Array.from(
      { length: selectedGMs.length },
      (_, index) => index + 1
    );
    // Range from 1/N to 1
    selectedGMsRangeY.forEach(
      (y, index, selectedGMsRangeY) =>
        (selectedGMsRangeY[index] = y / selectedGMs.length)
    );

    return (
      <Plot
        className={"specific-im-plot"}
        data={[
          {
            x: cdfX,
            y: cdfY,
            mode: "lines+markers",
            name: "GCIM",
            line: { shape: "hv", color: "black" },
            type: "scatter",
          },
          {
            x: realisations.sort(),
            y: realisationsRangeY,
            mode: "lines+markers",
            name: "Realisations",
            line: { shape: "hv", color: "red" },
            type: "scatter",
          },
          {
            x: selectedGMs.sort(),
            y: selectedGMsRangeY,
            mode: "lines+markers",
            name: "GMs",
            line: { shape: "hv", color: "blue" },
            type: "scatter",
          },
        ]}
        layout={{
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

export default FirstPlot;
