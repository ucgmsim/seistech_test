import React, { Fragment } from "react";

import { Tabs, Tab } from "react-bootstrap";

import {
  SiteSelectionMap,
  SiteSelectionVS30,
  SiteSelectionRegional,
} from "components/Hazard/SiteSelection";

const SiteSelectionViewer = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey="map">
        <Tab eventKey="map" title="Map">
          <SiteSelectionMap />
        </Tab>

        <Tab eventKey="regional" title="Regional">
          <SiteSelectionRegional />
        </Tab>

        <Tab eventKey="vs30" title="VS30">
          <SiteSelectionVS30 />
        </Tab>
      </Tabs>
    </Fragment>
  );
};
export default SiteSelectionViewer;
