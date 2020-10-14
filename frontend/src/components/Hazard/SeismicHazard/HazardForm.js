import React, { Fragment } from "react";
import "assets/style/HazardForms.css";

import HazardCurveSection from "./HazardCurveSection";
import DisaggregationSection from "./DisaggregationSection";
import UHSSection from "./UHSSection";
import NZS1170Section from "./NZS1170Section";

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
