import React, { useContext, Fragment, useEffect, useState } from "react";
import Select from "react-select";

import { GlobalContext } from "context";

const IMSelect = ({ title, setIM }) => {
  const { IMs, setIMVectors } = useContext(GlobalContext);

  const [localIMs, setLocalIMs] = useState([]);

  useEffect(() => {
    let localIMs = IMs.map((IM) => ({
      value: IM,
      label: IM,
    }));
    setLocalIMs(localIMs);
    setIMVectors(localIMs);
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
      />
    </Fragment>
  );
};

export default IMSelect;
