import React, { Fragment } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";

import "assets/style/HazardForms.css";

import HazardViewerHazardCurve from "./HazardViewerHazardCurve";

const HazardViewer = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey="hazardCurve" className="hazard-viewer-tabs">
        <Tab eventKey="hazardCurve" title="Hazard Curve">
          <HazardViewerHazardCurve />
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
