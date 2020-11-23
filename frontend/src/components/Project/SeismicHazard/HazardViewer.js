import React, { Fragment, useContext, useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";

import { GlobalContext } from "context";

import "assets/style/HazardForms.css";

const HazardViewer = () => {
  const {
    isTabEnabled,
    selectedIM,
    hazardCurveComputeClick,
    disaggComputeClick,
    uhsComputeClick,
  } = useContext(GlobalContext);

  const [selectedTab, setSelectedTab] = useState("hazardCurve");

  // Hazard Form, IM selected and "Compute" clicked
  useEffect(() => {
    if (
      hazardCurveComputeClick !== null &&
      selectedIM !== null &&
      isTabEnabled("hazard:hazard")
    ) {
      setSelectedTab("hazardCurve");
    }
  }, [hazardCurveComputeClick]);

  useEffect(() => {
    if (
      disaggComputeClick !== null &&
      selectedIM !== null &&
      isTabEnabled("hazard:disagg")
    ) {
      setSelectedTab("disagg");
    }
  }, [disaggComputeClick]);

  useEffect(() => {
    if (uhsComputeClick !== null && isTabEnabled("hazard:uhs")) {
      setSelectedTab("uhs");
    }
  }, [uhsComputeClick]);

  return (
    <Fragment>
      <Tabs
        activeKey={selectedTab}
        className="hazard-viewer-tabs"
        onSelect={(k) => setSelectedTab(k)}
      >
        <Tab eventKey="hazardCurve" title="Hazard Curve">
          Project - Hazard Curve
        </Tab>
        <Tab eventKey="disagg" title="Disaggregation">
          Project - Disaggregation
        </Tab>
        <Tab eventKey="uhs" title="Uniform Hazard Spectrum">
          Project - UHS
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default HazardViewer;
