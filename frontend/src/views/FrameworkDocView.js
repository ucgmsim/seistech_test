import React, { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";

import testFile from "../assets/documents/test.md";

const FrameworkDocView = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(testFile)
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className="hazard-inner">
      <div className="row two-column-row">
        <div className="col-3 controlGroup form-panel">Test</div>
        <div className="col-9 controlGroup form-viewer">
          <div className="two-column-view-right-pane">
            <ReactMarkdown source={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkDocView;
