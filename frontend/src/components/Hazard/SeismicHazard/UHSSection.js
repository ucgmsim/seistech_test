import React, { useState, useContext, useEffect } from "react";
import * as CONSTANTS from "constants/Constants";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { renderSigfigs, disableScrollOnNumInput } from "utils/Utils";
import TextField from "@material-ui/core/TextField";

const UHSSection = () => {
  const {
    uhsRateTable,
    setUHSComputeClick,
    isTabEnabled,
    uhsTableAddRow,
    uhsTableDeleteRow,
  } = useContext(GlobalContext);

  const [disableButtonUHSCompute, setDisableButtonUHSCompute] = useState(true);

  const [uhsAnnualProb, setUHSAnnualProb] = useState(
    CONSTANTS.DEFAULT_ANNUAL_PROB
  );

  disableScrollOnNumInput();

  const validExdRate = () => {
    return uhsAnnualProb > 0 && uhsAnnualProb < 1;
  };

  useEffect(() => {
    setDisableButtonUHSCompute(
      uhsRateTable.length === 0 || isTabEnabled("hazard:uhs") !== true
    );
  }, [uhsRateTable]);

  // rate calcs

  const onClickUHSTableAdd = () => {
    if (uhsRateTable.some((item) => item === uhsAnnualProb)) {
      return;
    }

    uhsTableAddRow(uhsAnnualProb);
  };

  let localUHSRateTable = uhsRateTable.map((rate, idx) => {
    const returnPeriod = renderSigfigs(
      1 / parseFloat(rate),
      CONSTANTS.APP_UI_SIGFIGS
    );

    return (
      <tr id={"uhs-row-" + idx} key={idx}>
        <td>
          {renderSigfigs(rate, CONSTANTS.APP_UI_UHS_RATETABLE_RATE_SIGFIGS)}
        </td>
        <td>{returnPeriod}</td>
        <td>
          <div
            className="uhs-delete-row"
            title="Delete Row"
            onClick={() => onClickDeleteRow(idx)}
          >
            <FontAwesomeIcon icon="trash" />
          </div>
        </td>
      </tr>
    );
  });

  function onClickDeleteRow(id) {
    if (id === 0 && uhsRateTable[0] === CONSTANTS.UHS_TABLE_MESSAGE) {
      return;
    }
    uhsTableDeleteRow(id);
  }

  return (
    <div>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group form-section-title">
          <span>Uniform Hazard Spectrum</span>
        </div>
        <div className="form-group">
          <label
            id="label-annual-rate"
            htmlFor="uhs-annual-rate"
            className="control-label"
          >
            Annual Exceedance Rate
          </label>
          <TextField
            id="uhs-annual-rate"
            type="number"
            value={uhsAnnualProb}
            onChange={(e) => setUHSAnnualProb(e.target.value)}
            placeholder="(0, 1)"
            fullWidth
            variant="outlined"
            error={
              (uhsAnnualProb > 0 && uhsAnnualProb < 1) || uhsAnnualProb === ""
                ? false
                : true
            }
            helperText={
              (uhsAnnualProb > 0 && uhsAnnualProb < 1) || uhsAnnualProb === ""
                ? " "
                : "Annual Exceedance Rate must be between 0 and 1. (0 < X < 1)"
            }
          />
        </div>
        <div className="form-group">
          <button
            type="button"
            className="btn btn-primary disagg-calc"
            onClick={onClickUHSTableAdd}
            disabled={!validExdRate()}
          >
            Add
          </button>
        </div>
      </form>

      <div className="form-group">Add one or more rates for calculation</div>

      <div className="form-group">
        <table id="uhs-added">
          <thead>
            <tr>
              <th>Rate</th>
              <th>Return Period</th>
              <th className="uhs-delete-row" title="Click to Delete the Row">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>{localUHSRateTable}</tbody>
        </table>
      </div>

      <div className="form-group">
        <button
          id="uhs-update-plot"
          type="button"
          className="btn btn-primary mt-2"
          disabled={disableButtonUHSCompute}
          onClick={() => {
            setUHSComputeClick(uuidv4());
          }}
        >
          Compute
        </button>
      </div>
    </div>
  );
};

export default UHSSection;
