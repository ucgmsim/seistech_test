import React, { Fragment } from "react";

// Under Hazard Analysis, it splits screen to left and right
class TwoColumnView extends React.Component {
  render() {
    const Left = this.props.cpanel;
    const Right = this.props.viewer;

    return (
      <Fragment>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 control-group">
              <Left />
            </div>
            <div className="col-lg-9 control-group">
              <Right />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default TwoColumnView;
