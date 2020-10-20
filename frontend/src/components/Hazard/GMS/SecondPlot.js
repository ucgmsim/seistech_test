import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const SecondPlot = ({ gmsData, periods }) => {
  if (
    gmsData !== null &&
    !gmsData.hasOwnProperty("error") &&
    periods !== []
  ) {
    const cdfX = gmsData["gcim_cdf_x"];
    const cdfY = gmsData["gcim_cdf_y"];
    const realisations = gmsData["realisations"];
    const selectedGMs = gmsData["selected_GMs"];

    // console.log(gmsData)
    // console.log(periods)

    const scatterObjs = [];


    // // Create range for Realisations, 0 ~ 1
    // let realisationsRangeY = [];
    // for (let i = 1; i < realisations.length; i++) {
    //   realisationsRangeY.push(i / (realisations.length - 1));
    // }
    // // Add 0 in index 0;
    // realisationsRangeY.splice(0, 0, 0);

    // // Create range for Realisations, 0 ~ 1
    // let selectedGMsRangeY = [];
    // for (let i = 1; i < selectedGMs.length; i++) {
    //   selectedGMsRangeY.push(i / (selectedGMs.length - 1));
    // }
    // // Add 0 in index 0;
    // selectedGMsRangeY.splice(0, 0, 0);

    // console.log("NEW RANGE: ", realisationsRangeY);
    // console.log("NEW RANGE: ", selectedGMsRangeY);

    // return (
    //   <Plot
    //     className={"specific-im-plot"}
    //     data={[
    //       {
    //         x: cdfX,
    //         y: cdfY,
    //         mode: "lines+markers",
    //         name: "GCIM",
    //         line: { shape: "hv", color: "black" },
    //         type: "scatter",
    //       },
    //       {
    //         x: realisations.sort(),
    //         y: realisationsRangeY,
    //         mode: "lines+markers",
    //         name: "Realisations",
    //         line: { shape: "hv", color: "red" },
    //         type: "scatter",
    //       },
    //       {
    //         x: selectedGMs.sort(),
    //         y: selectedGMsRangeY,
    //         mode: "lines+markers",
    //         name: "GMs",
    //         line: { shape: "hv", color: "blue" },
    //         type: "scatter",
    //       },
    //     ]}
    //     layout={{
    //       autosize: true,
    //       margin: PLOT_MARGIN,
    //     }}
    //     useResizeHandler={true}
    //     config={{ displayModeBar: true }}
    //   />
      
    // );
  }
  return <ErrorMessage />;
};

export default SecondPlot;
