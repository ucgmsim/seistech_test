import React from "react";

import Plot from "react-plotly.js";
import { PLOT_MARGIN } from "constants/Constants";
import ErrorMessage from "components/common/ErrorMessage";

import "assets/style/GMSPlot.css";

const FourthPlot = ({ gmsData }) => {
  const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step) + 1)
      .fill(start)
      .map((x, y) => x + y * step);

  if (gmsData !== null) {
    const metadata = gmsData["metadata"];

    console.log("BEFORE DO ANYTHING");
    console.log(typeof metadata["mag"]);
    console.log(typeof metadata["rrup"]);
    console.log(typeof metadata["vs30"]);

    const mag = metadata["mag"]
      .flatMap((x) => Array(2).fill(x))
      .sort((a, b) => {
        return a - b;
      });
    const rrup = metadata["rrup"]
      .flatMap((x) => Array(2).fill(x))
      .sort((a, b) => {
        return a - b;
      });
    const vs30 = metadata["vs30"]
      .flatMap((x) => Array(2).fill(x))
      .sort((a, b) => {
        return a - b;
      });

    console.log("AFTER RECREATING IT: ");
    console.log("MAG: ", mag);
    console.log("RRUP: ", rrup);
    console.log("VS30: ", vs30);
    console.log(typeof mag);
    console.log(typeof rrup);
    console.log(typeof vs30);

    const rangeY = range(0, 1, 1 / mag.length);

    const newRangeY = rangeY.flatMap((x, i) =>
      Array(i === 0 || i === rangeY.length - 1 ? 1 : 2).fill(x)
    );

    return (
      <Plot
        className={"fourth-plot"}
        data={[
          {
            x: mag,
            y: newRangeY,
            mode: "lines+markers",
            name: "Magnitude",
            line: { shape: "hv", color: "blue" },
            type: "scatter",
          },
          {
            x: rrup,
            y: newRangeY,
            mode: "lines+markers",
            name: "rrup",
            line: { shape: "hv", color: "red" },
            type: "scatter",
          },
          {
            x: vs30,
            y: newRangeY,
            mode: "lines+markers",
            name: "VS30",
            line: { shape: "hv", color: "green" },
            type: "scatter",
          },
        ]}
        layout={{
          xaxis: {
            title: { text: "Metadata" },
          },
          yaxis: {
            title: { text: "0 to 1" },
          },
          autosize: true,
          margin: PLOT_MARGIN,
        }}
        useResizeHandler={true}
        config={{ displayModeBar: true }}
      />
    );
  }
  return <ErrorMessage />;
};

export default FourthPlot;
