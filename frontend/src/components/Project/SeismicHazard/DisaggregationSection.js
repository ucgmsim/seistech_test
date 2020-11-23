import React, { useState, useContext, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import { disableScrollOnNumInput } from "utils/Utils";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";

const HazardCurveSection = () => {
  const [returnPeriod, setReturnPeriod] = useState(null);
  const { projectSelectedIM } = useContext(GlobalContext);

  const options = [
    {
      value: "A Test",
      label: "A Test",
    },
    {
      value: "B Test",
      label: "B Test",
    },
    {
      value: "C Test",
      label: "C Test",
    },
  ];

  const displayInConsole = () => {
    console.log(
      `Im Disaggregation Return Period: ${returnPeriod} and selected IM ${projectSelectedIM}`
    );
  };

  return (
    <Fragment>
      <div className="form-group form-section-title">
        <span>Disaggregation</span>
      </div>
      <div className="form-group">
        <label
          id="label-disagg-return-period"
          htmlFor="disagg-return-period"
          className="control-label"
        >
          Return Period
        </label>
        <Select
          id="disagg-return-period"
          placeholder={options.length === 0 ? "Loading..." : "Select..."}
          onChange={(e) => setReturnPeriod(e.value)}
          options={options}
          isDisabled={options.length === 0 || projectSelectedIM === null}
        />
      </div>

      <div className="form-group">
        <button
          id="project-hazard-curve-get-btn"
          type="button"
          className="btn btn-primary"
          disabled={returnPeriod === null}
          onClick={() => {
            displayInConsole();
          }}
        >
          Get
        </button>
      </div>
    </Fragment>
  );
};

export default HazardCurveSection;
