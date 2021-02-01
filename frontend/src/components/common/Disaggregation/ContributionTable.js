import React from "react";
import * as CONSTANTS from "constants/Constants";
import { renderSigfigs } from "utils/Utils";
import { ErrorMessage } from "components/common";

const ContributionTable = ({ firstTable, secondTable }) => {
  if (
    firstTable !== null &&
    !firstTable.hasOwnProperty("error") &&
    secondTable !== null &&
    !secondTable.hasOwnProperty("error")
  ) {
    const firstTableRow = [];
    const secondTableRows = [];

    // First table configuration
    firstTableRow.push(
      <tr key="first-table">
        <td>{firstTable["im"]}</td>
        <td>
          {renderSigfigs(
            firstTable["mean_values"]["magnitude"],
            CONSTANTS.APP_UI_SIGFIGS
          )}
        </td>
        <td>
          {renderSigfigs(
            firstTable["mean_values"]["rrup"],
            CONSTANTS.APP_UI_SIGFIGS
          )}
        </td>
        <td>
          {renderSigfigs(
            firstTable["mean_values"]["epsilon"],
            CONSTANTS.APP_UI_SIGFIGS
          )}
        </td>
      </tr>
    );
    // Second table configuration
    let contribRowClassname = "";

    secondTable.forEach((entry, rowIdx) => {
      let firstCol = entry[1] === undefined ? entry[0] : entry[1];
      let secondCol =
        entry[2] === undefined
          ? "-"
          : Number(entry[2] * 100).toLocaleString(undefined, {
              maximumSignificantDigits: 4,
            });
      let thirdCol =
        entry[3] === undefined || isNaN(entry[3])
          ? "-"
          : Number(entry[3]).toExponential(4);
      let fourthCol = entry[4] === undefined ? "-" : entry[4];
      let fifthCol =
        entry[5] === undefined || isNaN(entry[3])
          ? "-"
          : renderSigfigs(entry[5], CONSTANTS.APP_UI_SIGFIGS);

      if (rowIdx === CONSTANTS.APP_UI_CONTRIB_TABLE_ROWS - 1) {
        contribRowClassname = "contrib-toggle-row contrib-row-hidden";
      }

      secondTableRows.push(
        <tr key={entry[0]} className={contribRowClassname}>
          <td>{firstCol}</td>
          <td>{secondCol}</td>
          <td>{thirdCol}</td>
          <td>{fourthCol}</td>
          <td>{fifthCol}</td>
        </tr>
      );
    });

    return (
      <div className="d-flex flex-column align-items-md-center">
        {/* First table */}
        <table className="table thead-dark table-striped table-bordered mt-2 w-auto">
          <thead>
            <tr>
              <th scope="col">IM</th>
              <th scope="col">Mean magnitude</th>
              <th scope="col">Rrup (km)</th>
              <th scope="col">Epsilon</th>
            </tr>
          </thead>
          <tbody>{firstTableRow}</tbody>
        </table>
        <br />
        {/* Second table */}
        <table className="table thead-dark table-striped table-bordered mt-2 w-auto">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Contribution (%)</th>
              <th scope="col">Annual recurrence rate</th>
              <th scope="col">Magnitude</th>
              <th scope="col">Rrup (km)</th>
            </tr>
          </thead>
          <tbody>
            {secondTableRows}
            <tr className="contrib-ellipsis">
              <td colSpan="5" className="contrib-ellipsis">
                (more..)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  return <ErrorMessage />;
};

export default ContributionTable;
