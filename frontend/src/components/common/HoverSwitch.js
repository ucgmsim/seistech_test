import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const HoverSwitch = ({ toggleState, changeToggleState, disabledStatus }) => {
  return (
    <FormGroup className="project-uhs-toggle-btn">
      <FormControlLabel
        control={
          <Switch
            checked={toggleState}
            onChange={(e) => changeToggleState(e.target.checked)}
            disabled={disabledStatus}
            color="primary"
            name="hoverToggle"
          />
        }
        label="Hover detail"
        labelPlacement="start"
      />
    </FormGroup>
  );
};

export default HoverSwitch;
