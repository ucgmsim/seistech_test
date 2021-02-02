import React, { Fragment, useState, useRef } from "react";

import { Overlay, Tooltip } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "assets/style/GuideTooltip.css";

const GuideTooltip = ({ explanation }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <Fragment>
      <span onClick={() => setShow(!show)} ref={target}>
        <FontAwesomeIcon icon="question-circle" size="xs" className="ml-1" />
      </span>

      <Overlay target={target.current} show={show} placement="right">
        {(props) => <Tooltip {...props}>{explanation}</Tooltip>}
      </Overlay>
    </Fragment>
  );
};

export default GuideTooltip;
