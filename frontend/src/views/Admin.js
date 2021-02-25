import React, { Fragment } from "react";

import { Tabs, Tab } from "react-bootstrap";

import EditUserPermission from "components/Admin/EditUserPermission";
import ProjectPermissionDashboard from "components/Admin/ProjectPermissionDashboard";
import PagePermissionDashboard from "components/Admin/PagePermissionDashboard";
import SingleColumnView from "components/common/SingleColumnView";

import "assets/style/AdminPage.css";

const Admin = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey="edit-user" className="admin-tabs">
        <Tab eventKey="edit-user" title="Edit Users Permission">
          <SingleColumnView pageComponent={EditUserPermission} />
        </Tab>
        <Tab
          eventKey="project-permission-dashboard"
          title="Project Permission Dashboard"
        >
          <SingleColumnView pageComponent={ProjectPermissionDashboard} />
        </Tab>
        <Tab
          eventKey="page-permission-dashboard"
          title="Page Permission Dashboard"
        >
          <SingleColumnView pageComponent={PagePermissionDashboard} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default Admin;
