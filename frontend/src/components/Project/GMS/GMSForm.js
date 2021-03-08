import React, { Fragment, useState, useEffect, useContext } from "react";

import $ from "jquery";
import { v4 as uuidv4 } from "uuid";
import { Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";

import { IMSelect } from "components/common";
import { renderSigfigs, handleErrors } from "utils/Utils";

import "assets/style/GMSForm.css";

const GMSForm = () => {
  const { getTokenSilently } = useAuth0();

  const {
    selectedEnsemble,
    station,
    vs30,
    IMVectors,
    setComputedGMS,
  } = useContext(GlobalContext);

  return <Fragment>Project - GMSForm</Fragment>;
};

export default GMSForm;
