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
  // For Promise.all which is sending multiple requests simultaneously
  if (response.length > 1) {
    for (const eachResponse of response) {
      if (eachResponse.status !== 200) {
        console.log(Error(response.statusText));
        throw response.status;
      }
    }
    // For a single request.
  } else {
    if (response.status !== 200) {
      /* 
        Debug purpose
        This can be replaced if we implement front-end logging just like we did on Core API (Saving logs in a file somehow)
        Until then, console.log to invest while developing
      */
      console.log(Error(response.statusText));
      throw response.status;
    }
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
  Create an special aray for react-select
*/
export const createSelectArray = (options) => {
  let selectOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  return selectOptions;
};

/*
  Create an special aray for react-select - Special case, value and label are different - Specially made for Project IDs
*/
export const createProjectIDArray = (options) => {
  let selectOptions = [];

  for (const [key, value] of Object.entries(options)) {
    selectOptions.push({ value: key, label: value });
  }

  return selectOptions;
};

/*
  Check the IM list and decide to disable the UHS input field.
  No pSA in IM(return true), we disable the UHS
*/
export const checkIMwithPSA = (givenIMList) => {
  for (let i = 0; i < givenIMList.length; i++) {
    if (givenIMList[i].includes("pSA")) {
      return false;
    }
  }
  return true;
};

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

export const sortIMs = (unsortedIMs) => {
  const adjIMs = [];

  if (unsortedIMs.length !== 0) {
    for (const pattern of DEFAULT_PATTERN_ORDER) {
      const curIMs = Array.from(unsortedIMs, (x) => {
        if (x.startsWith(pattern) === true) {
          return x;
        }
      });

      const filteredCurIMs = curIMs.filter((element) => {
        return element !== undefined;
      });

      if (filteredCurIMs.length === 0) {
        continue;
      } else if (filteredCurIMs.length === 1) {
        adjIMs.push(filteredCurIMs[0]);
      } else {
        const tempSortedIMs = filteredCurIMs.sort((a, b) => {
          return a.split("_")[1] - b.split("_")[1];
        });
        tempSortedIMs.forEach((x) => {
          adjIMs.push(x);
        });
      }
    }
  }

  return adjIMs;
};
