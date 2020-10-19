import React, { useState, useEffect, useContext, Fragment } from "react";

import LoadingSpinner from "components/common/LoadingSpinner";
import DownloadButton from "components/common/DownloadButton";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";

const FirstPlot = ({ gmsData, IMs }) => {
  if (gmsData !== null && !gmsData.hasOwnProperty("error")) {
    const cdfX = gmsData["gcim_cdf_x"];
    const cdfY = gmsData["gcim_cdf_y"];
    const realisations = gmsData["realisations"];
    const selectedGMs = gmsData["selected_GMs"];

    console.log("RESPONSE DATA: ", cdfX, cdfY, realisations, selectedGMs);
    console.log("IMs ", IMs)
  }
  return <div>Somethings going to be here</div>;
};

export default FirstPlot;
