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

    // double the elements
    const newRealisations = realisations
      .sort((a, b) => {
        return a - b;
      })
      .flatMap((x) => Array(2).fill(x));

    const realisationsRangeY = range(0, 1, 1 / realisations.length);

    const newRealisationsRangeY = realisationsRangeY.flatMap((x, i) =>
      Array(i === 0 || i === realisationsRangeY.length - 1 ? 1 : 2).fill(x)
    );

    // double the elements
    const newSelectedGMs = selectedGMs
      .sort((a, b) => {
        return a - b;
      })
      .flatMap((x) => Array(2).fill(x));

    const selectedGMsRangeY = range(0, 1, 1 / selectedGMs.length);

    const newSelectedGMsRangeY = selectedGMsRangeY.flatMap((x, i) =>
      Array(i === 0 || i === selectedGMsRangeY.length - 1 ? 1 : 2).fill(x)
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
            x: newRealisations,
            y: newRealisationsRangeY,
            mode: "lines",
            name: "Realisations",
            line: { shape: "hv", color: "black" },
            type: "scatter",
          },
          {
            x: newSelectedGMs,
            y: newSelectedGMsRangeY,
            mode: "lines",
            name: "GMs",
            line: { shape: "hv", color: "blue" },
            type: "scatter",
          },
        ]}
        layout={{
          xaxis: {
            title: { text: "Peak ground velocity, PGV (cm/s)" },
            range: [0, Math.max(...cdfX, ...newRealisations, ...newSelectedGMs)]
          },
          yaxis: {
            title: { text: "Cumulative probability, CDF" },
            autorange: true
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
