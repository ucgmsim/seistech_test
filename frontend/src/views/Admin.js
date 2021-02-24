import React, { Fragment } from "react";

import { Tabs, Tab } from "react-bootstrap";

import EditUserPermission from "components/Admin/EditUserPermission";
import PermissionDashboard from "components/Admin/PermissionDashboard";
import SingleColumnView from "components/common/SingleColumnView";

import "assets/style/AdminPage.css";

const Admin = () => {
  return (
    <Fragment>
      <Tabs defaultActiveKey="edituser" className="admin-tabs">
        <Tab eventKey="edituser" title="Edit Users Permission">
          <SingleColumnView pageComponent={EditUserPermission} />
        </Tab>
        <Tab eventKey="dashboard" title="Permission Dashboard">
          <SingleColumnView pageComponent={PermissionDashboard} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default Admin;
