import React, { Fragment, useContext, useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";
import Select from "react-select";
import { GlobalContext } from "context";

import FirstPlot from "./FirstPlot";
import SecondPlot from "./SecondPlot";
import LoadingSpinner from "components/common/LoadingSpinner";

import "assets/style/GMSViewer.css"

const GMSViewer = () => {
  const { isLoading, computedGMS, selectedIMVectors } = useContext(
    GlobalContext
  );

  const [specifiedIM, setSpecifiedIM] = useState([]);
  const [localIMVectors, setLocalIMVectors] = useState([]);
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    // Create proper IM array for Select package
    let localIMs = selectedIMVectors.map((IM) => ({
      value: IM,
      label: IM,
    }));
    setLocalIMVectors(localIMs);

    // Get only period from IM
    let localPeriods = selectedIMVectors.map((IM) => {
      return IM.split("_")[1]
    });
    setPeriods(localPeriods);

  }, [selectedIMVectors]);

  return (
    <div className="gms-viewer">
      <Tabs defaultActiveKey="firstPlot">
        <Tab eventKey="firstPlot" title="Specific IM">
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              <Select
                id="im-vectors"
                onChange={(value) => setSpecifiedIM(value || [])}
                defaultValue={specifiedIM}
                options={localIMVectors}
              />
              <FirstPlot gmsData={computedGMS} IM={specifiedIM.value} />
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="secondPlot" title="Second Plot">
        {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              <SecondPlot gmsData={computedGMS} periods={periods}/>
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="thirdPlot" title="Third Plot">
          <div>HELLO</div>
        </Tab>
        <Tab eventKey="fourthPlot" title="Fourth Plot">
          <div>HELLO</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default GMSViewer;
