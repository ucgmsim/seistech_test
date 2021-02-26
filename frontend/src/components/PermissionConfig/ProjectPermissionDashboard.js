import React, { useState, useEffect } from "react";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import { handleErrors, createProjectIDArray } from "utils/Utils";
import { PermissionDashboard, LoadingSpinner } from "components/common";

import "assets/style/PermissionDashboard.css";

const ProjectPermissionDashboard = () => {
  const { getTokenSilently } = useAuth0();

  const [userData, setUserData] = useState({});
  const [userOption, setUserOption] = useState([]);

  const [allProjects, setAllProjects] = useState({});
  const [tableHeaderData, setTableHeaderData] = useState([]);

  const [allAvailableProjects, setAllAvailableProjects] = useState({});
  const [tableBodyData, setTableBodyData] = useState([]);

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
      setTableHeaderData(tempArray);
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

  /*
    Create an array of objects for table body
    We need to be sure that the following data aren't empty
    1. allAvailableProjects -> Data from UserDB, Available_Project table
    2. allProjects -> Data from Project API, All Projects we provide
    3. userOption -> Data from Auth0, existing users
  */
  useEffect(() => {
    if (
      (allAvailableProjects &&
        Object.keys(allAvailableProjects).length === 0 &&
        allAvailableProjects.constructor === Object) === false &&
      (allProjects &&
        Object.keys(allProjects).length === 0 &&
        allProjects.constructor === Object) === false &&
      userOption.length > 0
    ) {
      let tempArray = [];
      let tempObj = {};

      /*
        Loop through the object, allAvailableProjects
        Nested loop through another object, allprojects

        The key for a temp object property with "auth0-user-id", 
        is user-email. (using find function to find an object with auth0-id value
        This object is in the format of
        {value: auth0-id, label: email | auth0 or google auth}
        Then from a found object, use the label as we want email to be displayed

        Then, compare if user's available_projects (projects with permission),
        contains the project we provide, then it's true else false.
        )
      */
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

      setTableBodyData(tempArray);
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
    <div className="permission-dashboard">
      {tableHeaderData.length > 0 && tableBodyData.length > 0 ? (
        <PermissionDashboard
          tableHeaderData={tableHeaderData}
          tableBodyData={tableBodyData}
        />
      ) : (
        <LoadingSpinner className="permission-dashboard-loading-spinner" />
      )}
    </div>
  );
};

export default ProjectPermissionDashboard;
