import React, { Fragment, useContext } from "react";

import { Tabs, Tab } from "react-bootstrap";
import { GlobalContext } from "context";

import TwoColumnView from "components/common/TwoColumnView";

import {
  SiteSelectionForm,
  SiteSelectionViewer,
} from "components/Project/SiteSelection";
import { GMSForm, GMSViewer } from "components/Project/GMS";
import { HazardForm, HazardViewer } from "components/Project/SeismicHazard";

const Project = () => {
  const { projectId, projectLocation, projectVS30 } = useContext(GlobalContext);

  const validateTab = () => {
    return (
      projectId === null || projectLocation === null || projectVS30 === null
    );
  };

  return (
    <Fragment>
      <Tabs defaultActiveKey="siteselection" className="hazard-tabs">
        <Tab eventKey="siteselection" title="Site Selection">
          <TwoColumnView
            cpanel={SiteSelectionForm}
            viewer={SiteSelectionViewer}
          />
        </Tab>

        <Tab
          eventKey="hazard"
          title="Seismic Hazard"
          disabled={validateTab()}
          tabClassName="seismic-hazard-tab"
        >
          <TwoColumnView cpanel={HazardForm} viewer={HazardViewer} />
        </Tab>

        <Tab eventKey="gms" title="GMS" disabled tabClassName="gms-tab">
          <TwoColumnView cpanel={GMSForm} viewer={GMSViewer} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default Project;
