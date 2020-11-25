import React, { Fragment } from "react";

const MapImage = ({ source, alt }) => {
  return (
    <Fragment>
      <img
        className="rounded mx-auto d-block img-fluid"
        src={`data:image/png;base64,${source}`}
        alt={alt}
      />
    </Fragment>
  );
};

export default MapImage;
