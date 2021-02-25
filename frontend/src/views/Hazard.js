import React, { Fragment, useContext } from "react";

import { Tabs, Tab } from "react-bootstrap";

import { GlobalContext } from "context";
import { ENV } from "constants/Constants";

import { TwoColumnView } from "components/common";
import {
  SiteSelectionForm,
  SiteSelectionViewer,
} from "components/Hazard/SiteSelection";
import { GMSForm, GMSViewer } from "components/Hazard/GMS";
import { HazardForm, HazardViewer } from "components/Hazard/SeismicHazard";

const Hazard = () => {
  const { vs30, locationSetClick, nzCodeDefaultParams } = useContext(
    GlobalContext
  );

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
          disabled={
            locationSetClick === null ||
            vs30 === "" ||
            nzCodeDefaultParams.length === 0
          }
          tabClassName="seismic-hazard-tab"
        >
          <TwoColumnView cpanel={HazardForm} viewer={HazardViewer} />
        </Tab>

        <Tab
          eventKey="gms"
          title="Ground Motion Selection"
          disabled={ENV !== "DEV" || locationSetClick === null || vs30 === ""}
          tabClassName="gms-tab"
        >
          <TwoColumnView cpanel={GMSForm} viewer={GMSViewer} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default Hazard;
