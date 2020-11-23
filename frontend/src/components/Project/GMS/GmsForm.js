import React, { Fragment, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import { Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalContext } from "context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import IMSelect from "components/common/IMSelect";
import * as CONSTANTS from "constants/Constants";
import $ from "jquery";
import { renderSigfigs, handleErrors } from "utils/Utils";
import "assets/style/GMSForm.css";

const GmsForm = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    vs30,
    IMVectors,
    setComputedGMS,
  } = useContext(GlobalContext);
  

  return (
    <Fragment>
      Project - GMSForm
    </Fragment>
  );
};

export default GmsForm;
