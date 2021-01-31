import React, { useState, useEffect, useContext } from "react";

import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const ProjectCreate = () => {
  const animatedComponents = makeAnimated();

  const [displayName, setDisplayName] = useState("");
  const [projectID, setProjectID] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [vs30, setVs30] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [locationName, setLocationName] = useState("");
  const [disaggRP, setDisaggRP] = useState("");
  const [uhsRP, setUHSRP] = useState("");
  const [IM, setIM] = useState([]);
  const [accordionKey, setAccordionKey] = useState("null");

  // Dummy options
  const options = [
    { value: "TEST1", label: "TEST1" },
    { value: "TEST2", label: "TEST2" },
    { value: "TEST3", label: "TEST3" },
    { value: "TEST4", label: "TEST4" },
  ];

  const downArrow = <FontAwesomeIcon icon="caret-down" size="2x" />;
  const upArrow = <FontAwesomeIcon icon="caret-up" size="2x" />;

  const arrowSets = {
    true: downArrow,
    false: upArrow,
  };

  const [arrow, setArrow] = useState(true);

  useEffect(() => {
    if (radioValue === "custom") {
      setAccordionKey("0");
      setArrow(!arrow);
    } else {
      setAccordionKey("null");
      setArrow(!arrow);
    }
  }, [radioValue]);

  const updateAccordion = () => {
    if (accordionKey === "null") {
      setAccordionKey("0");
      setArrow(!arrow);
    } else {
      setAccordionKey("null");
      setArrow(!arrow);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-lg-center">
        <div className="col col-lg">
          <div className="jumbotron">
            <h1 className="display-4">New SeisTech Project</h1>
          </div>

          {/* 
            Display Name
            - Normal input
            - String 
            - Required*/}
          <div className="card  create-form-box">
            <h3 className="card-header">Display Name</h3>
            <div className="card-body">
              <div className="form-group">
                <TextField
                  id="display-name-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                  label="Required"
                  required
                />
              </div>
            </div>
          </div>

          {/* 
            ID (Internal Name, no spaces) 
            - Normal input
            - Can be left blank 
          */}
          <div className="card create-form-box">
            <h3 className="card-header">Project ID</h3>
            <div className="card-body">
              <div className="form-group">
                <TextField
                  id="project-id-input"
                  value={projectID}
                  onChange={(e) => setProjectID(e.target.value)}
                  fullWidth
                  label="Optional"
                />
              </div>
            </div>
          </div>

          {/* 
            Locations 
            - Normal input for Name
            - Number(Float) input for Lat, Lon, VS30
            - Name, Lat, Lon, VS30(multiple VS30 is possible)
            - Locations can be multiple rows
            - Required
          */}
          <div className="card create-form-box">
            <h3 className="card-header">Locations</h3>
            <div className="card-body">
              <div className="form-group">
                <div className="d-flex align-items-center">
                  <label
                    id="label-create-name"
                    htmlFor="create-name"
                    className="control-label"
                  >
                    Name
                  </label>
                  <TextField
                    id="create-name"
                    className="flex-grow-1"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex align-items-center">
                  <label
                    id="label-create-lng"
                    htmlFor="create-lng"
                    className="control-label"
                  >
                    Latitude
                  </label>
                  <TextField
                    id="create-lng"
                    className="flex-grow-1"
                    type="number"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="[-47.4, -34.3]"
                    error={
                      (lat >= -47.4 && lat <= -34.3) || lat === ""
                        ? false
                        : true
                    }
                    helperText={
                      (lat >= -47.4 && lat <= -34.3) || lat === ""
                        ? " "
                        : "Latitude must be within the range of NZ."
                    }
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex align-items-center">
                  <label
                    id="label-create-lng"
                    htmlFor="create-lng"
                    className="control-label"
                  >
                    Longitude
                  </label>
                  <TextField
                    id="create-lng"
                    className="flex-grow-1"
                    type="number"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="[165, 180]"
                    error={
                      (lng >= 165 && lng <= 180) || lng === "" ? false : true
                    }
                    helperText={
                      (lng >= 165 && lng <= 180) || lng === ""
                        ? " "
                        : "Longitude must be within the range of NZ."
                    }
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex align-items-center">
                  <label
                    id="label-create-vs30"
                    htmlFor="create-vs30"
                    className="control-label"
                  >
                    V<sub>S30</sub>
                  </label>
                  <TextField
                    id="create-vs30"
                    className="flex-grow-1"
                    type="number"
                    value={vs30}
                    onChange={(e) => setVs30(e.target.value)}
                    variant="outlined"
                  />
                </div>
              </div>
              <button>ADD</button>
            </div>
          </div>

          {/* 
            Package 
            - Radio button
            - PGA
            - PGA + pSA
            - Custom
            - Required   
          */}
          <div className="card create-form-box">
            <h3 className="card-header">Package</h3>
            <div className="card-body">
              <FormControl component="fieldset">
                <RadioGroup
                  name="package"
                  value={radioValue}
                  onChange={(e) => setRadioValue(e.target.value)}
                >
                  <FormControlLabel
                    value="pga"
                    control={<Radio />}
                    label="PGA"
                  />
                  <FormControlLabel
                    value="pga+psa"
                    control={<Radio />}
                    label="PGA+pSA"
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label="Custom"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>

          {/* 
            If Custom is chosen
            IMs
            - Dropdown
            - Multi

            pSA Periods

            Disagg RPs
            - String - However only numbers with comma
            - Multi

            UHS RPs
            - String - However only numbers with comma
            - Multi
          */}
          <Accordion activeKey={accordionKey} onSelect={updateAccordion}>
            <Card>
              <Accordion.Toggle
                as={Card.Header}
                eventKey="0"
                onClick={() => setArrow(!arrow)}
              >
                <div className="advanced-toggle-header">
                  <h3>Custom</h3>
                  {arrowSets[arrow]}
                </div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div className="card create-form-box">
                    <h3 className="card-header">IMs</h3>
                    <div className="card-body">
                      <div className="form-group">
                        <Select
                          id="create-project-id"
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          isMulti
                          value={IM.length === 0 ? [] : IM}
                          onChange={(value) => setIM(value || [])}
                          options={options}
                          isDisabled={radioValue !== "custom"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card create-form-box">
                    <h3 className="card-header">Disagg Return Periods</h3>
                    <div className="card-body">
                      <div className="form-group">
                        <TextField
                          id="project-custom-disagg-rp-input"
                          value={disaggRP}
                          onChange={(e) => setDisaggRP(e.target.value)}
                          fullWidth
                          disabled={radioValue !== "custom"}
                          placeholder={
                            radioValue === "custom" ? "" : "Custom usage"
                          }
                          variant={
                            radioValue === "custom" ? "outlined" : "filled"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card create-form-box">
                    <h3 className="card-header">UHS Return Periods</h3>
                    <div className="card-body">
                      <div className="form-group">
                        <TextField
                          id="project-uhs-rp-input"
                          value={uhsRP}
                          onChange={(e) => setUHSRP(e.target.value)}
                          fullWidth
                          disabled={radioValue !== "custom"}
                          placeholder={
                            radioValue === "custom" ? "" : "Custom usage"
                          }
                          variant={
                            radioValue === "custom" ? "outlined" : "filled"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <button className="btn btn-primary create-project-submit">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreate;
