import React, { Fragment, useContext, useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";

import { GlobalContext } from "context";

import FirstPlot from "./FirstPlot";
import LoadingSpinner from "components/common/LoadingSpinner";

const GMSViewer = () => {
  const {
    isLoading,
    computedGMS,
    selectedIMVectors,
  } = useContext(GlobalContext);

  return (
    <Fragment>
      <Tabs defaultActiveKey="firstPlot">
        <Tab eventKey="firstPlot" title="Specific IM">
          {
            isLoading === true && <LoadingSpinner />
          }
          {
            isLoading === false && computedGMS !== null && <FirstPlot gmsData={computedGMS} IMs={selectedIMVectors} />
          }
        </Tab>
        <Tab eventKey="secondPlot" title="Second Plot">
          <div>HELLO</div>
        </Tab>
        <Tab eventKey="thirdPlot" title="Third Plot">
          <div>HELLO</div>
        </Tab>
        <Tab eventKey="fourthPlot" title="Fourth Plot">
          <div>HELLO</div>
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export default GMSViewer;
