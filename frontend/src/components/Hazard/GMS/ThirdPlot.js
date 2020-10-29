import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const ThirdPlot = ({ gmsData, causalParamBounds }) => {
  const validateBounds = () => {
    let isValidated = false;
    Object.values(causalParamBounds).forEach(
      (x) => (isValidated = x === "" ? false : true)
    );
    return isValidated;
  };
  if (gmsData !== null && validateBounds()) {
    const metadata = gmsData["metadata"];

    /* 
      Plotting a Box with Causal Parameter Bounds 
      Mw Max
      Mw Min
      Rrup Max
      Rrup Min
    */
    const xMin = causalParamBounds["Rrupmin"];
    const xMax = causalParamBounds["Rrupmax"];
    const yMin = causalParamBounds["Mwmin"];
    const yMax = causalParamBounds["Mwmax"];

    const topBoundX = [xMin, xMax];
    const topBoundY = [yMax, yMax];
    const rightBoundX = [xMax, xMax];
    const rightBoundY = [yMin, yMax];
    const bottomBoundX = [xMin, xMax];
    const bottomBoundY = [yMin, yMin];
    const leftBoundX = [xMin, xMin];
    const leftBoundY = [yMin, yMax];

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
            showlegend: false,
          },
          {
            x: topBoundX,
            y: topBoundY,
            legendgroup: "Bounds",
            mode: "lines",
            name: "Bounds",
            line: { color: "red" },
            type: "scatter",
            showlegend: false,
          },
          {
            x: rightBoundX,
            y: rightBoundY,
            legendgroup: "Bounds",
            mode: "lines",
            name: "Bounds",
            line: { color: "red" },
            type: "scatter",
            showlegend: false,
          },
          {
            x: bottomBoundX,
            y: bottomBoundY,
            legendgroup: "Bounds",
            mode: "lines",
            name: "Bounds",
            line: { color: "red" },
            type: "scatter",
            showlegend: false,
          },
          {
            x: leftBoundX,
            y: leftBoundY,
            legendgroup: "Bounds",
            mode: "lines",
            name: "Bounds",
            line: { color: "red" },
            type: "scatter",
            showlegend: false,
          },
        ]}
        layout={{
          xaxis: {
            type: "log",
            title: { text: `Distance, R${"rup".sub()} (km)` },
            showexponent: "first",
            exponentformat: "power",
            autorange: true,
          },
          yaxis: {
            title: { text: `Magnitude, M${"W".sub()}` },
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

export default ThirdPlot;
