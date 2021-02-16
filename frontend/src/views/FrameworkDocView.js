import React, { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import testFile from "../assets/documents/test.md";

import "assets/style/FrameworkDocView.css";

const FrameworkDocView = () => {
  // Could be a const array instead of Hook.
  // But by not using Hook, app will create this variable multiple times
  // Due to the re-rendering
  const [docEntries, setDocEntries] = useState(["test", "test2"]);

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(testFile)
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className="hazard-inner">
      <div className="row two-column-row">
        <div className="col-3 controlGroup form-panel" id="drawer-container">
          <Drawer
            variant="persistent"
            open={true}
            onClose={() => {}}
            PaperProps={{ style: { position: "absolute", width: "100%" } }}
            BackdropProps={{ style: { position: "absolute", width: "100%" } }}
            ModalProps={{
              container: document.getElementById("drawer-container"),
              style: { position: "absolute", width: "100%" },
            }}
          >
            <List>
              <ListItem button>
                <ListItemText>TEST</ListItemText>
              </ListItem>
            </List>
          </Drawer>
        </div>
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
