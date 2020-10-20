import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const FirstPlot = ({ gmsData, IM }) => {
  const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step) + 1)
      .fill(start)
      .map((x, y) => x + y * step);

  if (
    gmsData !== null &&
    !gmsData.hasOwnProperty("error") &&
    IM !== undefined
  ) {
    const cdfX = gmsData["gcim_cdf_x"][IM];
    const cdfY = gmsData["gcim_cdf_y"][IM];
    const realisations = gmsData["realisations"][IM];
    const selectedGMs = gmsData["selected_GMs"][IM];

    // double the elements
    const newRealisations = realisations.flatMap((x) => Array(2).fill(x));

    const realisationsRangeY = range(0, 1, 1 / realisations.length);

    const newRealisationsRangeY = realisationsRangeY.flatMap((x, i) =>
      Array(i === 0 || i === (realisationsRangeY.length - 1) ? 1 : 2).fill(x)
    );


    // double the elements
    const newSelectedGMs = selectedGMs.flatMap((x) => Array(2).fill(x));

    const selectedGMsRangeY = range(0, 1, 1 / selectedGMs.length);

    const newSelectedGMsRangeY = selectedGMsRangeY.flatMap((x, i) =>
      Array(i === 0 || i === (selectedGMsRangeY.length - 1) ? 1 : 2).fill(x)
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
            x: newRealisations.sort(),
            y: newRealisationsRangeY,
            mode: "lines+markers",
            name: "Realisations",
            line: { shape: "hv", color: "red" },
            type: "scatter",
          },
          {
            x: newSelectedGMs.sort(),
            y: newSelectedGMsRangeY,
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
