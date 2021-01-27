import React, { useState, useContext, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import * as CONSTANTS from "constants/Constants";
import { disableScrollOnNumInput } from "utils/Utils";
import TextField from "@material-ui/core/TextField";

const DisaggregationSection = () => {
  const { setDisaggComputeClick, selectedIM, setDisaggAnnualProb } = useContext(
    GlobalContext
  );

  const [inputDisaggDisabled, setInputDisaggDisabled] = useState(true);

  const [localExceedance, setLocalExceedance] = useState(
    CONSTANTS.DEFAULT_ANNUAL_PROB
  );

  disableScrollOnNumInput();

  const validExdRate = () => {
    return selectedIM !== null && localExceedance > 0 && localExceedance < 1;
  };

  useEffect(() => {
    setInputDisaggDisabled(selectedIM === null);
  }, [selectedIM]);

  return (
    <Fragment>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group form-section-title">
          <span>Disaggregation</span>
        </div>
        <div className="form-group">
          <label
            id="label-annual-rate"
            htmlFor="disagg-annual-rate"
            className="control-label"
          >
            Annual Exceedance Rate
          </label>
          <TextField
            id="disagg-annual-rate"
            type="number"
            value={localExceedance}
            onChange={(e) => setLocalExceedance(e.target.value)}
            placeholder="(0, 1)"
            fullWidth
            variant={inputDisaggDisabled ? "filled" : "outlined"}
            InputProps={{
              readOnly: inputDisaggDisabled,
            }}
            error={
              (localExceedance > 0 && localExceedance < 1) ||
              localExceedance === ""
                ? false
                : true
            }
            helperText={
              (localExceedance > 0 && localExceedance < 1) ||
              localExceedance === ""
                ? " "
                : "Annual Exceedance Rate must be between 0 and 1. (0 < X < 1)"
            }
          />
        </div>

        <div className="form-group">
          <button
            id="prob-update"
            type="button"
            className="btn btn-primary"
            disabled={!validExdRate()}
            onClick={() => {
              setDisaggAnnualProb(localExceedance);
              setDisaggComputeClick(uuidv4());
            }}
          >
            Compute
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default DisaggregationSection;
