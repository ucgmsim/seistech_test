import React from "react";

import "assets/style/TwoColumnView.css";

// Under Hazard Analysis, it splits screen to left and right
const TwoColumnView = ({ cpanel, viewer }) => {
  const Left = cpanel;
  const Right = viewer;

  return (
    <div className="two-column-inner">
      <div className="row two-column-row">
        <div className="col-3 controlGroup form-panel">
          <Left />
        </div>
        <div className="col-9 controlGroup form-viewer">
          <div className="two-column-view-right-pane">
            <Right />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnView;
