import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN, PLOT_CONFIG } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";
import { orderIMs } from "utils/Utils";

import "assets/style/GMSPlot.css";

const GMSViewerSpectra = ({ gmsData, periods, im_type, im_j }) => {
  if (gmsData !== null && !gmsData.hasOwnProperty("error") && periods !== []) {
    console.log("IM_j : ", im_type);
    console.log("Periods : ", periods);
    console.log("NOW ITS im_j: ", im_j);
    const cdfX = gmsData["gcim_cdf_x"];
    const cdfY = gmsData["gcim_cdf_y"];
    const realisations = gmsData["realisations"];
    const selectedGMs = gmsData["selected_GMs"];
    console.log(realisations);
    console.log(selectedGMs)

    // If IM Type starts with pSA, add it to periods
    if (im_type.startsWith("pSA")) {
      periods.push(im_type);
    }
    console.log(`Updated periods: ${periods}`);

    // Create an object key = IM, value = Period
    let localPeriods = {};
    orderIMs(periods).forEach((IM) => {
      localPeriods[IM] = IM.split("_")[1];
    });

    console.log("----------Array Object----------")
    for (const [key, value] of Object.entries(localPeriods)){
      console.log(`${key}: ${value}`);
    }
    console.log("----------Array Object----------")

    const periodsArray = Object.values(localPeriods);
    const scatterArr = [];
    const sortedCDFX = {};
    const sortedCDFY = {};
    const sortedRealisations = {};
    const sortedSelectedGMs = {};

    for (const [IM, values] of Object.entries(localPeriods)) {
      if (IM !== im_type) {
        sortedCDFX[IM] = cdfX[IM];
        sortedCDFY[IM] = cdfY[IM];
        sortedRealisations[IM] = realisations[IM];
        sortedSelectedGMs[IM] = selectedGMs[IM];
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
      } else {
        medianIndexObj[IM] = im_j
        lowerPercenIndexObj[IM] = im_j
        higherPercenIndexObj[IM] = im_j
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
        upperPercenValues.push(im_j)
        medianValues.push(im_j)
        lowerPercenValues.push(im_j)
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

    console.log(`WHAT AM I?: ${sortedRealisations}`)
    /*
      Realisations calculation
   */
    for (let i = 0; i < Object.values(sortedRealisations)[0].length; i++) {
      let yCoords = [];
      for (const [IM, period] of Object.entries(sortedRealisations)) {
        if (IM !== im_type){
          yCoords.push(sortedRealisations[IM][i]);
        } else {
          yCoords.push(sortedRealisations[IM])
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

export default GMSViewerSpectra;
