import React, { Fragment, useState, useRef } from "react";

import { Overlay, Tooltip } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GuideTooltip = ({ explanation }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <Fragment>
      <div onClick={() => setShow(!show)} ref={target}>
        <FontAwesomeIcon icon="question-circle" size="xs" className="ml-1" />
      </div>

      <Overlay target={target.current} show={show} placement="right">
        {(props) => <Tooltip {...props}>{explanation}</Tooltip>}
      </Overlay>
    </Fragment>
  );
};

export default GuideTooltip;
