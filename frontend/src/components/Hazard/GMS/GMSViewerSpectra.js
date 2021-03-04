import React from "react";

import Plot from "react-plotly.js";

import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";

import "assets/style/GMSPlot.css";

const GMSViewerSpectra = ({ spectraData }) => {
  return spectraData.length === 0 ? (
    <p>something went wrong</p>
  ) : (
    <Plot
      className={"second-plot"}
      data={spectraData}
      layout={{
        xaxis: {
          type: "log",
          title: { text: "Period, T (s)" },
          showexponent: "first",
          exponentformat: "power",
          autorange: true,
        },
        yaxis: {
          type: "log",
          title: { text: "Spectral acceleration, SA (g)" },
          showexponent: "first",
          exponentformat: "power",
          autorange: true,
        },
        autosize: true,
        margin: PLOT_MARGIN,
      }}
      useResizeHandler={true}
      config={PLOT_CONFIG}
    />
  );
};

export default GMSViewerSpectra;
