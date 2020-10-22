import React, { Fragment, useContext, useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";
import Select from "react-select";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";

import FirstPlot from "./FirstPlot";
import SecondPlot from "./SecondPlot";
import ThirdPlot from "./ThirdPlot";
import LoadingSpinner from "components/common/LoadingSpinner";
import GuideMessage from "components/common/GuideMessage";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSViewer.css";

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

    // Set the first IM as a default IM for plot
    setSpecifiedIM(localIMs[0]);

    // Create an object key = IM, value = Period
    let localPeriods = {};
    selectedIMVectors.forEach((IM) => {
      localPeriods[IM] = IM.split("_")[1];
    });
    setPeriods(localPeriods);
  }, [selectedIMVectors]);

  const validateComputedGMS = () => {
    let isValidResponse = true;

    Object.values(computedGMS).forEach((x) => {
      if (Object.keys(x).length === 0) {
        isValidResponse = false;
      }
    });

    return isValidResponse;
  };

  return (
    <div className="gms-viewer">
      <Tabs defaultActiveKey="firstPlot">
        <Tab eventKey="firstPlot" title="Specific IM">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : (
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
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="secondPlot" title="Second Plot">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : (
                <SecondPlot gmsData={computedGMS} periods={periods} />
              )}
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="thirdPlot" title="Third Plot">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
          {isLoading === false && computedGMS !== null && (
            <Fragment>
              {validateComputedGMS() === false ? (
                <ErrorMessage />
              ) : (
                <ThirdPlot gmsData={computedGMS} />
              )}
            </Fragment>
          )}
        </Tab>
        <Tab eventKey="fourthPlot" title="Fourth Plot">
          {isLoading === false && computedGMS === null && (
            <GuideMessage
              header={CONSTANTS.GMS}
              body={CONSTANTS.GMS_VIEWER_GUIDE_MSG}
              instruction={CONSTANTS.GMS_VIEWER_GUIDE_INSTRUCTION}
            />
          )}
          {isLoading === true && <LoadingSpinner />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default GMSViewer;
