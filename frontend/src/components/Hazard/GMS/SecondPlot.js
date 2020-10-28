import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const SecondPlot = ({ gmsData, periods }) => {
  if (gmsData !== null && !gmsData.hasOwnProperty("error") && periods !== []) {
    const cdfX = gmsData["gcim_cdf_x"];
    const cdfY = gmsData["gcim_cdf_y"];
    const realisations = gmsData["realisations"];
    const selectedGMs = gmsData["selected_GMs"];

    const scatterArr = [];

    /*
      GCIM calculations
    */
    const medianIndexObj = {};
    const lowerPercenIndexObj = {};
    const higherPercenIndexObj = {};

    // We are going to compare Y value to 0.5 (Median), 0.16 (16th percentile) and 0.84 (84th percentile)
    for (const [IM, values] of Object.entries(cdfY)) {
      // Median
      const medianFound = values.find((element) => element >= 0.5);
      medianIndexObj[IM] = values.indexOf(medianFound);

      // 0.16 (16th percentile)
      const lowerPercentileFound = values.find((element) => element >= 0.16);
      lowerPercenIndexObj[IM] = values.indexOf(lowerPercentileFound);

      // 0.84 (84th percentile)
      const higherPercentileFound = values.find((element) => element >= 0.84);
      higherPercenIndexObj[IM] = values.indexOf(higherPercentileFound);
    }

    const upperPercenValues = [];
    const medianValues = [];
    const lowerPercenValues = [];

    for (const [IM, values] of Object.entries(cdfX)) {
      upperPercenValues.push(values[higherPercenIndexObj[IM]]);
      medianValues.push(values[medianIndexObj[IM]]);
      lowerPercenValues.push(values[lowerPercenIndexObj[IM]]);
    }

    scatterArr.push(
      {
        x: Object.values(periods),
        y: upperPercenValues,
        mode: "lines+markers",
        name: "GCIM - 84th Percentile",
        line: { dash: "dashdot", color: "red" },
        type: "scatter",
      },
      {
        x: Object.values(periods),
        y: medianValues,
        mode: "lines+markers",
        name: "GCIM - Median",
        line: { color: "red" },
        type: "scatter",
      },
      {
        x: Object.values(periods),
        y: lowerPercenValues,
        mode: "lines+markers",
        name: "GCIM - 16th percentile",
        line: { dash: "dashdot", color: "red" },
        type: "scatter",
      }
    );

    /*
      Realisations calculation
    */
    for (let i = 0; i < Object.values(realisations)[0].length; i++) {
      let yCoords = [];
      for (const [IM, period] of Object.entries(realisations)) {
        yCoords.push(realisations[IM][i]);
      }
      scatterArr.push({
        x: Object.values(periods),
        y: yCoords,
        legendgroup: "Realisations",
        mode: "lines+markers",
        name: "Realisations",
        line: { color: "blue" },
        type: "scatter",
        showlegend: i === 0 ? true : false,
      });
    }
    /*
      Selected GMs calculation
    */
    for (let i = 0; i < Object.values(selectedGMs)[0].length; i++) {
      let yCoords = [];
      for (const [IM, period] of Object.entries(selectedGMs)) {
        yCoords.push(selectedGMs[IM][i]);
      }
      scatterArr.push({
        x: Object.values(periods),
        y: yCoords,
        legendgroup: "Selected GMs",
        mode: "lines+markers",
        name: "Selected GMs",
        line: { color: "green" },
        type: "scatter",
        showlegend: i === 0 ? true : false,
      });
    }

    return (
      <Plot
        className={"second-plot"}
        data={scatterArr}
        layout={{
          xaxis: {
            type: "log",
            title: { text: "Period, T (s)" },
            showexponent: "first",
            exponentformat: "power",
          },
          yaxis: {
            type: "log",
            title: { text: "Spectral acceleration, SA (g)" },
            showexponent: "first",
            exponentformat: "power",
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

export default SecondPlot;
