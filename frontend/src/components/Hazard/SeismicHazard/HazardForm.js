import React, { Fragment } from "react";

import {
  HazardCurveSection,
  DisaggregationSection,
  UHSSection,
  NZS1170p5Section,
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

      <NZS1170p5Section />
    </Fragment>
  );
};

export default HazardForm;
