import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";

import { createSelectArray, createProjectIDArray } from "utils/Utils";

const ProjectSelect = ({
  id,
  value,
  setSelect,
  options,
  placeholder = "Loading...",
  isProjectID = false,
}) => {
  const [localOptions, setLocalOptions] = useState([]);

  useEffect(() => {
    if (options !== undefined && options.length !== 0) {
      let tempOptions =
        isProjectID === true
          ? createProjectIDArray(options)
          : createSelectArray(options);

      setLocalOptions(tempOptions);
    } else {
      setLocalOptions([]);
    }
  }, [options]);

  return (
    <Fragment>
      <Select
        id={id}
        value={value === undefined || value === null ? [] : value.value}
        placeholder={localOptions.length === 0 ? placeholder : "Select..."}
        onChange={(e) => setSelect(e.value)}
        options={localOptions}
        isDisabled={localOptions.length === 0}
      />
    </Fragment>
  );
};

export default ProjectSelect;
