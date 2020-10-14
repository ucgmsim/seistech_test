import React, { useContext } from "react";
import { GlobalContext } from "context";

const NZS1170Section = () => {
  const {
    nzs1170ComputeClick,
    setNZS1170ComputeClick,
    showNZS1170,
    setShowNZS1170,

    nzs1170Input,
    setNZS1170Input,
    nzs1170SiteClass,
    setNZS1170SiteClass,
  } = useContext(GlobalContext);
  // TODO - See whether this can be an another one-liner as we are not dealing with this at this point
  const onChangeComputeNZS1170 = (e) => {
    setNZS1170ComputeClick(nzs1170ComputeClick === "true" ? "false" : "true");
  };

  const onChangeShowNZS1170 = (e) => {
    setShowNZS1170(showNZS1170 === "true" ? "false" : "true");
  };

  // TODO - See whether this can be an another one-liner as we are not dealing with this at this point
  const onChangeNZS1170Input = (e) => {
    setNZS1170Input(e.target.value);
  };

  const onChangeNZS1170SiteClass = (e) => {
    setNZS1170SiteClass(e.target.value);
  };
  return (
    <div>
      <div className="form-group form-section-title">
        <span>NZS1170</span>
      </div>

      <div className="form-group table">
        <div className="form-group">
          <input type="checkbox" onChange={onChangeComputeNZS1170} disabled />
          <span className="show-nzs">&nbsp;Compute NZS1170.5 hazard</span>
        </div>

        <div className="form-group">
          <input type="checkbox" onChange={onChangeShowNZS1170} disabled />
          <span className="show-nzs">&nbsp;Show NZS1170.5 hazard</span>
        </div>

        <div className="t-row uhs-params">
          <div className="t-cell">
            <span>Z=</span>
            <input
              type="number"
              className="form-control uhs"
              value={nzs1170Input}
              onChange={onChangeNZS1170Input}
              disabled
            />
          </div>
          <div className="t-cell">
            <span>SiteClass=</span>
            <select
              id="site-class"
              className="form-control"
              value={nzs1170SiteClass}
              onChange={onChangeNZS1170SiteClass}
              disabled
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <button id="prob-update" type="button" className="btn btn-primary" disabled>
          Compute
        </button>
      </div>
    </div>
  );
};

export default NZS1170Section;
