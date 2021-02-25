import React, { useEffect, useState } from "react";
import Select from "react-select";

import { GuideTooltip } from "components/common";

import { createSelectArray } from "utils/Utils";

const IMSelect = ({ title, setIM, options, guideMSG = null }) => {
  const [localIMs, setLocalIMs] = useState([]);

  useEffect(() => {
    let localIMs = createSelectArray(options);

    setLocalIMs(localIMs);
  }, [options]);

  return (
    <div className="custom-form-group">
      <label
        className="im-selector-label"
        htmlFor="IMs"
        className="control-label"
      >
        {title}
      </label>
      {guideMSG !== null ? <GuideTooltip explanation={guideMSG} /> : null}
      <Select
        id="IMs"
        placeholder={localIMs.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setIM(e.value)}
        options={localIMs}
        isDisabled={localIMs.length === 0}
      />
    </div>
  );
};

export default IMSelect;
