import React, { useContext, Fragment, useEffect, useState } from "react";
import { GlobalContext } from "context";
import { disableScrollOnNumInput } from "utils/Utils";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const SiteConditions = () => {
  const [localVS30, setLocalVS30] = useState("");

  const { vs30, setVS30, defaultVS30, locationSetClick } = useContext(
    GlobalContext
  );

  disableScrollOnNumInput();

  const onClickDefaultVS30 = () => {
    setVS30(defaultVS30);
    setLocalVS30(Number(defaultVS30).toFixed(1));
  };

  useEffect(() => {
    if (locationSetClick !== null && vs30 === defaultVS30 && vs30 !== "") {
      setLocalVS30(Number(defaultVS30).toFixed(1));
      // When we reset them
    } else if (vs30 === "" && defaultVS30 === "") {
      setLocalVS30("");
    }
  }, [vs30, defaultVS30, locationSetClick]);

  return (
    <Fragment>
      <div className="form-row">
        <span>
          Edit V<sub>S30</sub> to use non-default value.
        </span>
      </div>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <div className="d-flex align-items-center">
            <label id="label-vs30" htmlFor="vs30" className="control-label">
              V<sub>S30</sub>
            </label>
            <TextField
              id="vs30"
              className="flex-grow-1"
              type="number"
              value={localVS30}
              onChange={(e) => setLocalVS30(e.target.value)}
              variant={
                locationSetClick === null || vs30 === "" ? "filled" : "outlined"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">m/s</InputAdornment>
                ),
                readOnly: locationSetClick === null || vs30 === "",
              }}
            />
          </div>
        </div>
      </form>
      <div className="form-row">
        <button
          id="setVS30"
          type="button"
          className="btn btn-primary"
          disabled={locationSetClick === null || vs30 === ""}
          onClick={() => setVS30(localVS30)}
        >
          Set VS30
        </button>
        <button
          id="vs30useDefault"
          type="button"
          className="btn btn-primary default-button"
          disabled={vs30 === defaultVS30}
          onClick={() => onClickDefaultVS30()}
        >
          Use Default
        </button>
      </div>
    </Fragment>
  );
};

export default SiteConditions;
