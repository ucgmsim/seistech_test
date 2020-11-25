import React, { Fragment } from "react";

const SiteSelectionRegional = ({ source }) => {
  return (
    <Fragment>
      <img
        className="rounded mx-auto d-block img-fluid"
        src={`data:image/png;base64,${source}`}
        alt="Regional Map"
      />
    </Fragment>
  );
};

export default SiteSelectionRegional;
