import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const ThirdPlot = ({ gmsData }) => {
  if (gmsData !== null) {
    const metadata = gmsData["metadata"];

    return (
      <Plot
        className={"third-plot"}
        data={[
          {
            x: metadata["rrup"],
            y: metadata["mag"],
            mode: "markers",
            name: "GCIM",
            line: { color: "black" },
            type: "scatter",
          },
        ]}
        layout={{
          xaxis: {
            title: { text: `Distance, R${"rup".sub()} (km)` },
          },
          yaxis: {
            title: { text: `Magnitude, M${"W".sub()}` },
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

export default ThirdPlot;
