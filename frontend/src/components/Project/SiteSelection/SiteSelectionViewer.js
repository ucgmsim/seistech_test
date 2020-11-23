import React, { Fragment } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";


const SiteSelectionViewer = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey="map">
        <Tab eventKey="map" title="Map" className="tab-content">
          Project - Site Selection Map
        </Tab>

        <Tab eventKey="regional" title="Regional">
        Project - Regional Map
        </Tab>

        <Tab eventKey="vs30" title="VS30">
        Project - VS30 Map
        </Tab>
      </Tabs>
    </Fragment>
  );
};
export default SiteSelectionViewer;
