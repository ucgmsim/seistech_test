import React, { Fragment } from "react";
import "assets/style/HazardForms.css";

import HazardCurveSection from "./HazardCurveSection";
import DisaggregationSection from "./DisaggregationSection";
import UHSSection from "./UHSSection";

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
