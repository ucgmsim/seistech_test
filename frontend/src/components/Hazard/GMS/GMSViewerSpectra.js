import React from "react";

import Plot from "react-plotly.js";

import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import { sortIMs } from "utils/Utils";

import "assets/style/GMSPlot.css";

const GMSViewerSpectra = ({ gmsData }) => {
  const cdfX = gmsData["gcim_cdf_x"];
  const cdfY = gmsData["gcim_cdf_y"];
  const realisations = gmsData["realisations"];
  const selectedGMs = gmsData["selected_GMs"];
  const im_j = gmsData["im_j"];
  const periods = gmsData["IMs"];
  const im_type = gmsData["IM_j"];

  // If IM Type starts with pSA, add it to periods
  if (im_type.startsWith("pSA")) {
    periods.push(im_type);
  }

  // Create an object key = IM, value = Period
  const localPeriods = {};
  sortIMs(periods).forEach((IM) => {
    // With out current format, IM starts with pSA, they have period.
    // So we can find whether its the one with period or not
    if (IM.startsWith("pSA")) {
      localPeriods[IM] = IM.split("_")[1];
    }
  });

  const periodsArray = Object.values(localPeriods);
  const scatterArr = [];
  const sortedCDFX = {};
  const sortedCDFY = {};
  const sortedRealisations = {};
  const sortedSelectedGMs = {};

  /*
      Loop through the period object (That is in the right order).
      Create another objects in the right order for the following data:
      - CDF X
      - CDF Y
      - Realisations
      - Selected GMs
      as response data may not be in the right order.
      So we can plot them in the right order.
    */
  for (const [IM, values] of Object.entries(localPeriods)) {
    // If IM (IM from IM Vectors) is not same as IM_Type, we do different approach.
    if (IM !== im_type) {
      sortedCDFX[IM] = cdfX[IM];
      sortedCDFY[IM] = cdfY[IM];
      sortedRealisations[IM] = realisations[IM];
      sortedSelectedGMs[IM] = selectedGMs[IM];
      // If IM is equal to IM Type, we put im_j as a y value,
      // selectedGMs is a bit different as the Core API
      //returns with its own data for this IM (which is equal to IM Type)
    } else {
      sortedCDFX[IM] = values;
      sortedCDFY[IM] = im_j;
      sortedRealisations[IM] = im_j;
      sortedSelectedGMs[IM] = selectedGMs[IM];
    }
  }

  /*
      GCIM calculations
    */
  const medianIndexObj = {};
  const lowerPercenIndexObj = {};
  const higherPercenIndexObj = {};

  // We are going to compare Y value to 0.5 (Median), 0.16 (16th percentile) and 0.84 (84th percentile)
  for (const [IM, values] of Object.entries(sortedCDFY)) {
    // We only find Median, percentiles that is not IM Type
    if (IM !== im_type) {
      // Median
      const medianFound = values.find((element) => element >= 0.5);
      medianIndexObj[IM] = values.indexOf(medianFound);

      // 0.16 (16th percentile)
      const lowerPercentileFound = values.find((element) => element >= 0.16);
      lowerPercenIndexObj[IM] = values.indexOf(lowerPercentileFound);

      // 0.84 (84th percentile)
      const higherPercentileFound = values.find((element) => element >= 0.84);
      higherPercenIndexObj[IM] = values.indexOf(higherPercentileFound);
      // If IM is equal to IM Type, then we want to make one point to be met for whole lines, regardless of percentiles
    } else {
      medianIndexObj[IM] = im_j;
      lowerPercenIndexObj[IM] = im_j;
      higherPercenIndexObj[IM] = im_j;
    }
  }

  const upperPercenValues = [];
  const medianValues = [];
  const lowerPercenValues = [];

  for (const [IM, values] of Object.entries(sortedCDFX)) {
    // We only find Median, percentiles that is not IM Type
    if (IM !== im_type) {
      upperPercenValues.push(values[higherPercenIndexObj[IM]]);
      medianValues.push(values[medianIndexObj[IM]]);
      lowerPercenValues.push(values[lowerPercenIndexObj[IM]]);
    } else {
      upperPercenValues.push(im_j);
      medianValues.push(im_j);
      lowerPercenValues.push(im_j);
    }
  }

  // GCIM Plots
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
      Object.values(sortedRealisations)[0] - number of elements in each values which is basically same as Num Ground Motions input
      First for loop is there to set the index
      Second for loop is there to put every IM's index realisation value.

      E.g.,
      pSA_0.01: [1,2,3]
      pSA_0.02: [2,3,4]
      pSA_0.03: [4,5,6]

      after this loop, we plot three lines like the following,
      X array = [0.01, 0.02, 0.03] (Because X-axis is periods)
      Y array = [1,2,4] (first index)
              = [2,3,5] (second index)
              = [3,4,6] (third index)
   */
  for (let i = 0; i < Object.values(sortedRealisations)[0].length; i++) {
    let yCoords = [];
    for (const IM of Object.keys(sortedRealisations)) {
      if (IM !== im_type) {
        yCoords.push(sortedRealisations[IM][i]);
      } else {
        yCoords.push(sortedRealisations[IM]);
      }
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
      Same as Realisations caluclation above.
      Except, because Selected GMs come with selected IM Type's values.
      So no need to check whether the IM Type is same to IM.
   */
  for (let i = 0; i < Object.values(sortedSelectedGMs)[0].length; i++) {
    let yCoords = [];
    for (const IM of Object.keys(sortedSelectedGMs)) {
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
};

export default GMSViewerSpectra;
