import React, { Fragment, useEffect, useState, useContext } from "react";
import Select from "react-select";

import { GlobalContext } from "context";

import { createSelectArray } from "utils/Utils";

const IMSelect = ({ title, setIM }) => {
  const { IMs } = useContext(GlobalContext);

  const [localIMs, setLocalIMs] = useState([]);

  useEffect(() => {
    let localIMs = createSelectArray(IMs);

    setLocalIMs(localIMs);
  }, [IMs]);

  return (
    <Fragment>
      <pre>{title}</pre>
      <Select
        id="IMs"
        placeholder={IMs.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setIM(e.value)}
        options={localIMs}
        isDisabled={IMs.length === 0}
        menuPlacement="auto"
      />
    </Fragment>
  );
};

export default IMSelect;
