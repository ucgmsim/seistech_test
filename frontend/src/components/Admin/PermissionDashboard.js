import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { handleErrors, createProjectIDArray } from "utils/Utils";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "95%",
  },
  container: {
    maxHeight: "85%",
  },
});

const PermissionDashboard = () => {
  const { getTokenSilently } = useAuth0();

  const classes = useStyles();

  const [userData, setUserData] = useState({});
  const [userOption, setUserOption] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allProjects, setAllProjects] = useState({});
  const [tableHeaders, setTableHeaders] = useState([]);

  const [allAvailableProjects, setAllAvailableProjects] = useState({});
  const [tableBody, setTableBody] = useState([]);

  /*
    Fetchig All projets we have from Project API to become a table's header
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getProjects = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.MIDDLEWARE_API_ROUTE_GET_ALL_PROJECTS_FROM_PROJECT_API,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: signal,
          }
        )
          .then(handleErrors)
          .then(async (response) => {
            const responseData = await response.json();
            setAllProjects(responseData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getProjects();

    return () => {
      abortController.abort();
    };
  }, []);

  /*
    Based on all projects name we pulled from above useEffect Hook,
    Create an array of objects to set the table's header
  */
  useEffect(() => {
    // If and only if the object is not empty, create list for table's header
    if (
      (allProjects &&
        Object.keys(allProjects).length === 0 &&
        allProjects.constructor === Object) === false
    ) {
      let tempArray = [
        {
          id: "auth0-user-id",
          label: "Auth0 ID",
        },
      ];
      for (const [key, value] of Object.entries(allProjects)) {
        tempArray.push({
          id: key,
          label: value.project_full_name,
        });
      }
      setTableHeaders(tempArray);
    }
  }, [allProjects]);

  /*
    Pull every row from Available_Project table
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAllAvailableProjects = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.MIDDLEWARE_API_ROUTE_GET_ALL_ROW_FROM_AVAILABLE_PROJECT_TABLE,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: signal,
          }
        )
          .then(handleErrors)
          .then(async (response) => {
            const responseData = await response.json();
            setAllAvailableProjects(responseData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getAllAvailableProjects();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    // If and only if the object is not empty, create list for table's body
    if (
      (allAvailableProjects &&
        Object.keys(allAvailableProjects).length === 0 &&
        allAvailableProjects.constructor === Object) === false &&
      (allProjects &&
        Object.keys(allProjects).length === 0 &&
        allProjects.constructor === Object) === false &&
      userOption.length !== 0
    ) {
      let tempArray = [];
      let tempObj = {};

      for (const [user_id, available_projects] of Object.entries(
        allAvailableProjects
      )) {
        for (const [project_code, project_detail] of Object.entries(
          allProjects
        )) {
          tempObj["auth0-user-id"] = userOption.find(
            (user) => user.value === user_id
          ).label;
          tempObj[project_code] = available_projects.includes(
            project_detail.project_id
          )
            ? "true"
            : "false";
        }
        tempArray.push(tempObj);
        tempObj = {};
      }

      setTableBody(tempArray);
    }
  }, [allAvailableProjects, allProjects, userOption]);

  /*
    Fetching user information from the API(Auth0)
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getUserInfo = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL + CONSTANTS.MIDDLEWARE_API_ROUTE_GET_USER,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: signal,
          }
        )
          .then(handleErrors)
          .then(async (users) => {
            const responseUserData = await users.json();
            setUserData(responseUserData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getUserInfo();

    return () => {
      abortController.abort();
    };
  }, []);

  /*
    Create an Array of objects with the following format
    {
      value: auth0-id,
      label: user_email | Auth0 or Google Auth
    }
  */
  useEffect(() => {
    if (Object.entries(userData).length > 0) {
      setUserOption(createProjectIDArray(userData));
    }
  }, [userData]);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell
                  key={header.id}
                  style={{ minWidth: header.minWidth }}
                  align={"center"}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableBody
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((eachUser) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={eachUser["auth0-user-id"]}
                  >
                    {tableHeaders.map((header) => {
                      const value = eachUser[header.id];
                      console.log(eachUser[header.id]);
                      return (
                        <TableCell
                          key={header.id}
                          align={"center"}
                          style={
                            header.id === "auth0-user-id"
                              ? { backgroundColor: "white" }
                              : value === "true"
                              ? { backgroundColor: "green" }
                              : { backgroundColor: "red" }
                          }
                        >
                          {header.id === "auth0-user-id" ? value : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PermissionDashboard;
