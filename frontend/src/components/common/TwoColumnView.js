import React from "react";

// Under Hazard Analysis, it splits screen to left and right
class TwoColumnView extends React.Component {
  render() {
    const Left = this.props.cpanel;
    const Right = this.props.viewer;

    return (
      <div className="hazard-inner">
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
  }
}

export default TwoColumnView;
