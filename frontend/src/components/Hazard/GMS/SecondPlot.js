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

    const periodsArray = Object.values(periods);
    const scatterArr = [];
    const sortedCDFX = {};
    const sortedCDFY = {};
    const sortedRealisations = {};
    const sortedSelectedGMs = {};

    for (const [IM, values] of Object.entries(periods)) {
      sortedCDFX[IM] = cdfX[IM];
      sortedCDFY[IM] = cdfY[IM];
      sortedRealisations[IM] = realisations[IM];
      sortedSelectedGMs[IM] = selectedGMs[IM];
    }

    /*
      GCIM calculations
    */
    const medianIndexObj = {};
    const lowerPercenIndexObj = {};
    const higherPercenIndexObj = {};

    // We are going to compare Y value to 0.5 (Median), 0.16 (16th percentile) and 0.84 (84th percentile)
    for (const [IM, values] of Object.entries(sortedCDFY)) {
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

    for (const [IM, values] of Object.entries(sortedCDFX)) {
      upperPercenValues.push(values[higherPercenIndexObj[IM]]);
      medianValues.push(values[medianIndexObj[IM]]);
      lowerPercenValues.push(values[lowerPercenIndexObj[IM]]);
    }

    scatterArr.push(
      {
        x: periodsArray,
        y: upperPercenValues,
        mode: "lines",
        name: "GCIM - 84th Percentile",
        line: { dash: "dashdot", color: "red" },
        type: "scatter",
      },
      {
        x: periodsArray,
        y: medianValues,
        mode: "lines",
        name: "GCIM - Median",
        line: { color: "red" },
        type: "scatter",
      },
      {
        x: periodsArray,
        y: lowerPercenValues,
        mode: "lines",
        name: "GCIM - 16th percentile",
        line: { dash: "dashdot", color: "red" },
        type: "scatter",
      }
    );

    /*
      Realisations calculation
    */
    for (let i = 0; i < Object.values(sortedRealisations)[0].length; i++) {
      let yCoords = [];
      for (const [IM, period] of Object.entries(sortedRealisations)) {
        yCoords.push(sortedRealisations[IM][i]);
      }
      scatterArr.push({
        x: periodsArray,
        y: yCoords,
        legendgroup: "Realisations",
        mode: "lines",
        name: "Realisations",
        line: { color: "black" },
        type: "scatter",
        showlegend: i === 0 ? true : false,
      });
    }
    /*
      Selected GMs calculation
    */
    for (let i = 0; i < Object.values(sortedSelectedGMs)[0].length; i++) {
      let yCoords = [];
      for (const [IM, period] of Object.entries(sortedSelectedGMs)) {
        yCoords.push(sortedSelectedGMs[IM][i]);
      }
      scatterArr.push({
        x: periodsArray,
        y: yCoords,
        legendgroup: "Selected GMs",
        mode: "lines",
        name: "Selected GMs",
        line: { color: "blue" },
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
  }
  return <ErrorMessage />;
};

export default SecondPlot;
