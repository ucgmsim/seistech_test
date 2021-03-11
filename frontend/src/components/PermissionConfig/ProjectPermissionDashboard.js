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

  const [allUsersPrivateProjects, setAllUsersPrivateProjects] = useState({});
  const [tableBodyData, setTableBodyData] = useState([]);

  /*
    Fetching All projects(Public and Private) we have from Project table which becomes a table's header
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAllProjects = async () => {
      try {
        const token = await getTokenSilently();

        await Promise.all([
          fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.INTERMEDIATE_API_ALL_PUBLIC_PROJECTS_ENDPOINT,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          ),
          fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.INTERMEDIATE_API_ALL_PRIVATE_PROJECTS_ENDPOINT,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          ),
        ])
          .then(handleErrors)
          .then(async ([publicProjects, privateProjects]) => {
            const publicProjectsData = await publicProjects.json();
            const privateProjectsData = await privateProjects.json();

            setAllProjects({
              public: { ...publicProjectsData },
              private: { ...privateProjectsData },
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getAllProjects();

    return () => {
      abortController.abort();
    };
  }, []);

  /*
    Based on all projects name we pulled from above useEffect Hook,
    Create an readable array of objects for material-ui table
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

      for (const access_level of Object.keys(allProjects)) {
        for (const [project_code, project_name] of Object.entries(
          allProjects[access_level]
        )) {
          tempArray.push({
            id: project_code,
            label: `${project_name} - ${access_level}`,
          });
        }
      }
      setTableHeaderData(tempArray);
    }
  }, [allProjects]);

  /*
    Pull every row from Users_Projects table
    Which is Private Project
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAllUsersProjects = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.INTERMEDIATE_API_ALL_USERS_PROJECTS_ENDPOINT,
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
            setAllUsersPrivateProjects(responseData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getAllUsersProjects();

    return () => {
      abortController.abort();
    };
  }, []);

  /*
    Create an array of objects for table body
    We need to be sure that the following data aren't empty
    1. allUsersPrivateProjects -> Data from Users_Projects table
    2. allProjects -> Data from Project table, All Public & Private projects
    3. userOption -> Data from Auth0, existing users
  */
  useEffect(() => {
    if (
      (allUsersPrivateProjects &&
        Object.keys(allUsersPrivateProjects).length === 0 &&
        allUsersPrivateProjects.constructor === Object) === false &&
      (allProjects &&
        Object.keys(allProjects).length === 0 &&
        allProjects.constructor === Object) === false &&
      userOption.length > 0
    ) {
      let tempArray = [];
      let tempObj = {};

      /*
        Loop through the object, allUsersPrivateProjects
        Nested loop through another object, allProjects

        The key for a temp object property with "auth0-user-id", 
        is user-email. (using find function to find an object with auth0-id value
        This object is in the format of
        {value: auth0-id, label: email | auth0 or google auth}
        Then from a found object, use the label as we want email to be displayed

        Then, compare if user's user_private_projects (projects with permission),
        contains the project we provide, then it's true else false.
        )
      */
      for (const [user_id, user_private_projects] of Object.entries(
        allUsersPrivateProjects
      )) {
        for (const access_level in allProjects) {
          tempObj["auth0-user-id"] = userOption.find(
            (user) => user.value === user_id
          ).label;
          // If access_level is public, default to true, means have permission to use
          if (access_level === "public") {
            for (const project_code in allProjects[access_level]) {
              tempObj[project_code] = "true";
            }
            // acces_level is not public, then compare with Users_Projects to check the permission
          } else {
            for (const project_code in allProjects[access_level]) {
              tempObj[project_code] = user_private_projects.includes(
                project_code
              )
                ? "true"
                : "false";
            }
          }
        }
        tempArray.push(tempObj);
        tempObj = {};
      }

      setTableBodyData(tempArray);
    }
  }, [allUsersPrivateProjects, allProjects, userOption]);

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
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.INTERMEDIATE_API_AUTH0_USERS_ENDPOINT,
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
