import React, { Fragment } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";

import SiteSelectionMap from "./SiteSelectionMap";
import SiteSelectionVs30 from "./SiteSelectionVS30";
import SiteSelectionRegional from "./SiteSelectionRegional";

const SiteSelectionViewer = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey="map">
        <Tab eventKey="map" title="Map">
          {/* <SiteSelectionMap /> */}
        </Tab>

        <Tab eventKey="regional" title="Regional">
          <SiteSelectionRegional />
        </Tab>

        <Tab eventKey="vs30" title="VS30">
          <SiteSelectionVs30 />
        </Tab>
      </Tabs>
    </Fragment>
  );
};
export default SiteSelectionViewer;
