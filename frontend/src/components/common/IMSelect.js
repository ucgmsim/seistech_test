import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

const IMSelect = ({ title, setIM, options }) => {
  const [localIMs, setLocalIMs] = useState([]);

  useEffect(() => {
    let localIMs = options.map((IM) => ({
      value: IM,
      label: IM,
    }));
    setLocalIMs(localIMs);
  }, [options]);

  return (
    <Fragment>
      <pre>{title}</pre>
      <Select
        id="IMs"
        placeholder={options.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setIM(e.value)}
        options={localIMs}
        isDisabled={options.length === 0}
      />
    </Fragment>
  );
};

export default IMSelect;
