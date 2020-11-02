import $ from "jquery";

export const disableScrollOnNumInput = () => {
  // disable mousewheel on a input number field when in focus
  // (to prevent Cromium browsers change the value when scrolling)
  $("form").on("focus", "input[type=number]", (e) => {
    $(e.currentTarget).on("wheel.disableScroll", (e) => {
      e.preventDefault();
    });
  });
  $("form").on("blur", "input[type=number]", (e) => {
    $(e.currentTarget).off("wheel.disableScroll");
  });
};

export const handleErrors = (response) => {
  if (!response.ok) {
    /* 
      Debug purpose
      This can be replaced if we implement front-end logging just like we did on Core API (Saving logs in a file somehow)
      Until then, console.log to invest while developing
    */
    console.log(Error(response.statusText));
    throw response.status;
  }
  return response;
};

/*
  Converts the Series json (which is a dict with each index value as a key),
  to two arrays ready for plotting.
*/
export const getPlotData = (data) => {
  const index = [];
  const values = [];
  for (let [key, value] of Object.entries(data)) {
    index.push(Number(key));
    values.push(value);
  }

  return { index: index, values: values };
};

/*
  Implement x sig figs for numeric float values
*/
export const renderSigfigs = (fullprecision, sigfigs) => {
  return Number.parseFloat(fullprecision).toPrecision(sigfigs);
};

/*
  Create an Array from start to stop by step
*/

export const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step) + 1)
    .fill(start)
    .map((x, y) => x + y * step);

/*
  JS version of qcore IM Sort
*/

const DEFAULT_PATTERN_ORDER = [
  "station",
  "component",
  "PGA",
  "PGV",
  "CAV",
  "AI",
  "Ds575",
  "Ds595",
  "Ds2080",
  "MMI",
  "pSA",
  "FAS",
  "IESDR",
];

export const orderIMs = (unsortedIMs) => {
  const adjIMs = [];

  if (unsortedIMs.length !== 0) {
    for (const pattern of DEFAULT_PATTERN_ORDER) {
      const curIMs = Array.from(unsortedIMs, (x) => {
        if (x.startsWith(pattern) === true) {
          return x;
        }
      });

      if (curIMs.length === 0) {
        continue;
      } else if (curIMs.length === 1) {
        adjIMs.push(curIMs[0]);
      } else {
        const tempSortedIMs = curIMs.sort((a, b) => {
          return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });
        tempSortedIMs.forEach((x) => {
          adjIMs.push(x);
        });
      }
    }
  }

  const filteredAdjIms = adjIMs.filter((element) => {
    return element !== undefined;
  });

  return filteredAdjIms;
};
