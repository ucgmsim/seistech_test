import React, { Fragment, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import "assets/style/GuideTooltip.css";

const GuideTooltip = ({ explanation }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => setOpen(true);

  return (
    <Fragment>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: false,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="right"
          interactive
          title={explanation}
          // title={<a href="https://naver.com">VISIT here!</a>}
          arrow
        >
          <span onClick={handleTooltipOpen}>
            <FontAwesomeIcon
              icon="question-circle"
              size="sm"
              className="ml-2"
            />
          </span>
        </Tooltip>
      </ClickAwayListener>
    </Fragment>
  );
};

export default GuideTooltip;
