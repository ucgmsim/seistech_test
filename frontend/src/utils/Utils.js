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

/**
 * Converts the Series json (which is a dict with each index value as a key),
 * to two arrays ready for plotting.
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

/**
 * Implement x sig figs for numeric float values
 */
export const renderSigfigs = (fullprecision, sigfigs) => {
  return Number.parseFloat(fullprecision).toPrecision(sigfigs);
};
