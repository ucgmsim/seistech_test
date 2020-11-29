import React, { Fragment, useEffect, useState, useContext } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";

import { GlobalContext } from "context";

import "assets/style/HazardForms.css";

import HazardViewerHazardCurve from "./HazardViewerHazardCurve";
import HazardViewerDisaggregation from "./HazardViewerDisaggregation";
import HazardViewerUHS from "./HazardViewerUHS";

const HazardViewer = () => {
  const {
    projectHazardCurveGetClick,
    projectDisaggGetClick,
    projectUHSGetClick,
  } = useContext(GlobalContext);

  const [selectedTab, setSelectedTab] = useState("hazardCurve");

  // When users click Get button, change the current to tab its tab to display plots/images
  useEffect(() => {
    if (projectHazardCurveGetClick !== null) {
      setSelectedTab("hazardCurve");
    }
  }, [projectHazardCurveGetClick]);

  useEffect(() => {
    if (projectDisaggGetClick !== null) {
      setSelectedTab("disagg");
    }
  }, [projectDisaggGetClick]);

  useEffect(() => {
    if (projectUHSGetClick !== null) {
      setSelectedTab("uhs");
    }
  }, [projectUHSGetClick]);

  return (
    <Fragment>
      <Tabs
        activeKey={selectedTab}
        className="hazard-viewer-tabs"
        onSelect={(key) => setSelectedTab(key)}
      >
        <Tab eventKey="hazardCurve" title="Hazard Curve">
          <HazardViewerHazardCurve />
        </Tab>
        <Tab eventKey="disagg" title="Disaggregation">
          <HazardViewerDisaggregation />
        </Tab>
        <Tab eventKey="uhs" title="Uniform Hazard Spectrum">
          <HazardViewerUHS />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default HazardViewer;
