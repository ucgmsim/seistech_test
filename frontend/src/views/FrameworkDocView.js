import React, { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import "assets/style/FrameworkDocView.css";

const importAll = (r) => r.keys().map(r);
const markdownFiles = importAll(
  require.context("assets/documents", false, /\.md$/)
).sort((a, b) => {
  const newA = a.substring(a.indexOf("a/") + 2, a.lastIndexOf("_"));

  const newB = b.substring(b.indexOf("a/") + 2, b.lastIndexOf("_"));

  return newA - newB;
});

const FrameworkDocView = () => {
  const [titleList, setTitleList] = useState([]);

  const [markdownList, setMarkdownList] = useState([]);

  const [selectedDoc, setSelectedDoc] = useState("");

  // Loading Markdowns
  useEffect(() => {
    const loadMarkdowns = async () => {
      const markdowns = await Promise.all(
        markdownFiles.map((file) =>
          fetch(file).then((response) => response.text())
        )
      );
      console.log(markdownFiles);
      setMarkdownList(markdowns);
    };

    loadMarkdowns();
  }, []);

  // Create an array of filenames
  // This will be used to load certain file to display based on the users choice
  useEffect(() => {
    const filesArray = markdownFiles.map((file) => {
      const file_name = file
        .substring(file.indexOf("a/") + 2, file.lastIndexOf("."))
        .split(".")[0];
      return file_name.split("_")[1];
    });

    setTitleList(filesArray);
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
              {titleList.map((title) => {
                return (
                  <ListItem
                    button
                    key={title}
                    onClick={() => setSelectedDoc(title)}
                  >
                    <ListItemText>{title}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        </div>
        <div className="col-9 controlGroup form-viewer">
          <div className="two-column-view-right-pane">
            <ReactMarkdown
              source={markdownList[titleList.indexOf(selectedDoc)]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkDocView;
