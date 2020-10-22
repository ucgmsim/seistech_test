import React, { Fragment, useContext } from "react";

import { Tabs, Tab } from "react-bootstrap";
import { GlobalContext } from "context";
import { ENV } from "constants/Constants";

import TwoColumnView from "components/common/TwoColumnView";

import SiteSelectionForm from "components/Hazard/SiteSelection/SiteSelectionForm";
import SiteSelectionViewer from "components/Hazard/SiteSelection/SiteSelectionViewer";

import GmsForm from "components/Hazard/GMS/GmsForm";
import GmsViewer from "components/Hazard/GMS/GmsViewer";

import HazardForm from "components/Hazard/SeismicHazard/HazardForm";
import HazardViewer from "components/Hazard/SeismicHazard/HazardViewer";

const Home = () => {
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
          disabled={locationSetClick === null || vs30 === ""}
        >
          <TwoColumnView cpanel={HazardForm} viewer={HazardViewer} />
        </Tab>

        <Tab
          eventKey="gms"
          title="GMS"
          disabled={ENV !== "DEV" || locationSetClick === null || vs30 === ""}
        >
          <TwoColumnView cpanel={GmsForm} viewer={GmsViewer} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default Home;