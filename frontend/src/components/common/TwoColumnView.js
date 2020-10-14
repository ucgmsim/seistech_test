import React, { Fragment } from "react";

// Under Hazard Analysis, it splits screen to left and right
class TwoColumnView extends React.Component {
  render() {
    const Left = this.props.cpanel;
    const Right = this.props.viewer;

    return (
      <Fragment>
        <div className="hazard-inner">
          <div className="row two-column-row">
            <div className="col-3 controlGroup form-panel">
              <div>
                <Left />
              </div>
            </div>
            <div className="col-9 controlGroup form-viewer">
              <div className="two-column-view-right-pane">
                <Right />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default TwoColumnView;
