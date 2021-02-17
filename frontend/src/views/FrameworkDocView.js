import React, { useState, useEffect, Fragment } from "react";

import ReactMarkdown from "react-markdown";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

// Reference
// https://webpack.js.org/guides/dependency-management/#requirecontext
const importAll = (r) => {
  return r.keys().map(r);
};
const getPrefixNum = (filePath) => {
  return filePath.substring(
    filePath.indexOf("a/") + 2,
    filePath.lastIndexOf("_")
  );
};
/* Read all the .md files in a given directory and sort them
  With one restriction, file must start with number to sort properly
  each variable would look something like this
  "/static/media/1_Hazard-test.bb7746c9.md"
*/
const markdownFiles = importAll(
  require.context("assets/documents", false, /\.md$/)
).sort((a, b) => {
  return getPrefixNum(a) - getPrefixNum(b);
});

// One of ways adding styles, this is specialized for Material-UI
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const getFilename = (filePath) => {
  return filePath
    .substring(filePath.indexOf("-") + 1, filePath.lastIndexOf("."))
    .split(".")[0];
};

const FrameworkDocView = () => {
  const classes = useStyles();

  const [selectedDoc, setSelectedDoc] = useState("");

  // This is the object that contains the markdown contents with filename as a property
  const [markdownTextObj, setMarkdownTextObj] = useState({});

  /* This is the object that contains the information of directory with files
   E.g. {
    projects: [1.md, 2.md, 3.md],
    hazard: [4.md, 5.md, 6.md]
  }
  */
  const [markdownFilesObj, setMarkdownFilesObj] = useState({});

  // Unfortunatley, we cannot create state hook dynamically, so must be hardcoded to control
  // each dropdown
  const [open, setOpen] = useState({
    Hazard: false,
    Projects: false,
  });

  // Used an object to the state, to change the certain property's value
  const handleClick = (status) => {
    setOpen((prevState) => ({
      ...prevState,
      [status]: !open[status],
    }));
  };

  /*
    Create an object of filename with its contents
    For intsance. {fileName: contents}
    {
      1: "HELO IM HERE! FROM 1.md!",
      2: "HELLO ME HERE FROM 2.md!"
    }
  */
  useEffect(() => {
    let tempFilesObj = {};

    const loadMarkdowns = async () => {
      for (let i = 0; i < markdownFiles.length; i++) {
        const file = markdownFiles[i];

        const fileName = getFilename(file);

        await fetch(file).then(async (response) => {
          const responseData = await response.text();
          tempFilesObj[fileName] = responseData;
        });
      }

      setMarkdownFilesObj(tempFilesObj);
    };

    loadMarkdowns();
  }, []);

  /* Create an object of filenames with directory name
    For instance, {directory: [files]}
    {
      projects: [1.md, 2.md, 3.md],
      hazard: [4.md, 5.md, 6.md]
    }
    
  */
  useEffect(() => {
    let tempObj = {};

    for (let i = 0; i < markdownFiles.length; i++) {
      const file = markdownFiles[i];
      const subHeaderTitle = file.substring(
        file.indexOf("_") + 1,
        file.lastIndexOf("-")
      );

      const fileName = getFilename(file);

      // Declare an object's property with Subheader's title
      if (tempObj.hasOwnProperty(subHeaderTitle) === false) {
        tempObj[subHeaderTitle] = [];
      }

      tempObj[subHeaderTitle].push(fileName);
    }

    setMarkdownTextObj(tempObj);
  }, []);

  return (
    <div className="hazard-inner">
      <div className="row two-column-row">
        <div className="col-3 controlGroup form-panel">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Documents
              </ListSubheader>
            }
            className={classes.root}
          >
            {Object.keys(markdownTextObj).map((title) => {
              return (
                <Fragment>
                  <ListItem button onClick={() => handleClick(title)}>
                    <ListItemText>{title}</ListItemText>
                    {open[title] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open[title]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {markdownTextObj[title].map((fileName) => (
                        <ListItem
                          button
                          className={classes.nested}
                          onClick={() => setSelectedDoc(fileName)}
                        >
                          <ListItemText>{fileName}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Fragment>
              );
            })}
          </List>
        </div>
        <div className="col-9 controlGroup form-viewer">
          <div className="two-column-view-right-pane">
            <ReactMarkdown source={markdownFilesObj[selectedDoc]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkDocView;
