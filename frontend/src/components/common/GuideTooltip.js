import React, { Fragment } from "react";

import { Tooltip, OverlayTrigger } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "assets/style/GuideTooltip.css";

const GuideTooltip = ({ explanation }) => {
  const renderTooltip = (props) => {
    return (
      <Tooltip id="guide-tooltip" {...props}>
        {explanation}
      </Tooltip>
    );
  };
  return (
    <Fragment>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <FontAwesomeIcon icon="question-circle" size="sm" className="ml-2" />
      </OverlayTrigger>
    </Fragment>
  );
};

export default GuideTooltip;
