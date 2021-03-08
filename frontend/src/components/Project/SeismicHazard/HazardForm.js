import React, { Fragment } from "react";

import {
  HazardCurveSection,
  DisaggregationSection,
  UHSSection,
} from "components/Project/SeismicHazard";

import "assets/style/HazardForms.css";

const HazardForm = () => {
  return (
    <Fragment>
      <HazardCurveSection />

      <div className="hr"></div>

      <DisaggregationSection />

      <div className="hr"></div>

      <UHSSection />
    </Fragment>
  );
};

export default HazardForm;
