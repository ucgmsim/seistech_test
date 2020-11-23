import React, { Fragment, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";
import { disableScrollOnNumInput, handleErrors } from "utils/Utils";
import TextField from "@material-ui/core/TextField";

import "assets/style/HazardForms.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SiteSelectionForm = () => {
  const { getTokenSilently } = useAuth0();

  
  return (
    <Fragment>
      Project - Site Selection Form
    </Fragment>
  );
};

export default SiteSelectionForm;
