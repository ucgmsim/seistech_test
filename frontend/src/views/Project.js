import React, { Fragment, useContext } from "react";

import { Tabs, Tab } from "react-bootstrap";
import { GlobalContext } from "context";
import { ENV } from "constants/Constants";

import TwoColumnView from "components/common/TwoColumnView";

import SiteSelectionForm from "components/Project/SiteSelection/SiteSelectionForm";
import SiteSelectionViewer from "components/Project/SiteSelection/SiteSelectionViewer";

import GmsForm from "components/Project/GMS/GmsForm";
import GmsViewer from "components/Project/GMS/GmsViewer";

import HazardForm from "components/Project/SeismicHazard/HazardForm";
import HazardViewer from "components/Project/SeismicHazard/HazardViewer";

const Project = () => {
  const { vs30, locationSetClick } = useContext(GlobalContext);

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
          // disabled={locationSetClick === null || vs30 === ""}
          tabClassName="seismic-hazard-tab"
        >
          <TwoColumnView cpanel={HazardForm} viewer={HazardViewer} />
        </Tab>

        <Tab
          eventKey="gms"
          title="GMS"
          // disabled={ENV !== "DEV" || locationSetClick === null || vs30 === ""}
          tabClassName="gms-tab"
        >
          <TwoColumnView cpanel={GmsForm} viewer={GmsViewer} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default Project;
