import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const ThirdPlot = ({ gmsData }) => {
  if (gmsData !== null) {
    const metadata = gmsData["metadata"];

    return (
      <Plot
        className={"specific-im-plot"}
        data={[
          {
            x: metadata["rrup"],
            y: metadata["mag"],
            mode: "markers",
            name: "GCIM",
            line: { color: "black" },
            type: "scatter",
            marker: { symbol: "x-open-dot", size: 20 },
          },
        ]}
        layout={{
          xaxis: {
            title: { text: "rrup" },
          },
          yaxis: {
            title: { text: "Magnitude" },
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

export default ThirdPlot;
