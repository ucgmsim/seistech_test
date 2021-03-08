import React, { Fragment } from "react";

import {
  HazardCurveSection,
  DisaggregationSection,
  UHSSection,
  NZS1170Section,
} from "components/Hazard/SeismicHazard";

import "assets/style/HazardForms.css";

const HazardForm = () => {
  return (
    <Fragment>
      <HazardCurveSection />

      <div className="hr"></div>

      <DisaggregationSection />

      <div className="hr"></div>

      <UHSSection />

      <div className="hr"></div>

      <NZS1170Section />
    </Fragment>
  );
};

export default HazardForm;
