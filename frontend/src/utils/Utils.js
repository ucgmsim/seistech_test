import $ from "jquery";

export const disableScrollOnNumInput = () => {
  // disable mousewheel on a input number field when in focus
  // (to prevent Cromium browsers change the value when scrolling)
  $("form").on("focus", "input[type=number]", function (e) {
    $(this).on("wheel.disableScroll", function (e) {
      e.preventDefault();
    });
  });
  $("form").on("blur", "input[type=number]", function (e) {
    $(this).off("wheel.disableScroll");
  });
};

export const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
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
