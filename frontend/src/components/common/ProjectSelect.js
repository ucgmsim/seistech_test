import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

import { createSelectArray } from "utils/Utils";

const ProjectSelect = ({ id, setSelect, options }) => {
  const [localOptions, setLocalOptions] = useState([]);

  useEffect(() => {
    if (options.length !== 0) {
      let tempOptions = createSelectArray(options);

      setLocalOptions(tempOptions);
    }
  }, [options]);

  return (
    <Fragment>
      <Select
        id={id}
        placeholder={localOptions.length === 0 ? "Loading..." : "Select..."}
        onChange={(e) => setSelect(e.value)}
        options={localOptions}
        isDisabled={localOptions.length === 0}
      />
    </Fragment>
  );
};

export default ProjectSelect;
