import React, { useState, useEffect } from "react";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import { handleErrors, createProjectIDArray } from "utils/Utils";
import { PermissionDashboard, LoadingSpinner } from "components/common";

import "assets/style/PermissionDashboard.css";

const PagePermissionDashboard = () => {
  const { getTokenSilently } = useAuth0();

  const [userData, setUserData] = useState({});
  const [userOption, setUserOption] = useState([]);

  const [allPermission, setAllPermission] = useState([]);
  const [tableHeaderData, setTableHeaderData] = useState([]);

  const [allUsersPermission, setAllUsersPermission] = useState({});
  const [tableBodyData, setTableBodyData] = useState([]);

  /*
    Fetchig All projets we have from Auth0_Permission table to become a table's header
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getProjects = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.INTERMEDIATE_API_ALL_PERMISSIONS_ENDPOINT,
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
            setAllPermission(responseData["all_permissions"]);
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
    Based on all permission name we pulled from the above useEffect Hook,
    Create a readable array of objects for material-ui table
  */
  useEffect(() => {
    // If and only if the object is not empty, create list for table's header
    if (allPermission.length > 0) {
      let tempArray = [
        {
          id: "auth0-user-id",
          label: "Auth0 ID",
        },
      ];
      for (let i = 0; i < allPermission.length; i++) {
        tempArray.push({
          id: allPermission[i],
          label: allPermission[i],
        });
      }

      setTableHeaderData(tempArray);
    }
  }, [allPermission]);

  /*
    Pull every row from the Users_Permissions table
    (Private projects that the user has permission)
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAllUsersPermissions = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.INTERMEDIATE_API_ALL_USERS_PERMISSIONS_ENDPOINT,
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
            setAllUsersPermission(responseData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getAllUsersPermissions();

    return () => {
      abortController.abort();
    };
  }, []);

  /*
    Create an array of objects for table body
    We need to be sure that the following data aren't empty
    1. allUsersPermission -> Data from the DB, Users_Permissions table
    2. allPermission -> Data from DB, Auth0_Permission table
    3. userOption -> Data from Auth0, existing users
  */
  useEffect(() => {
    if (
      (allUsersPermission &&
        Object.keys(allUsersPermission).length === 0 &&
        allUsersPermission.constructor === Object) ===
        false > 0 &&
      allPermission.length > 0 &&
      userOption.length > 0
    ) {
      let tempArray = [];
      let tempObj = {};

      /*
      Loop through the object, allUsersPermission
      Nested loop through the array, allPermission

      The key for a temp object property with "auth0-user-id", 
      is user-email. (using find function to find an object with auth0-id value
      This object is in the format of
      {value: auth0-id, label: email | auth0 or google auth}
      Then from a found object, use the label as we want email to be displayed

      Then, compare if user's users_permission table
      contains the permission we provide (Auth0), then it's true else false.
      )
    */
      for (const [user_id, user_permission] of Object.entries(
        allUsersPermission
      )) {
        for (let i = 0; i < allPermission.length; i++) {
          tempObj["auth0-user-id"] = userOption.find(
            (user) => user.value === user_id
          ).label;

          tempObj[allPermission[i]] = user_permission.includes(allPermission[i])
            ? "true"
            : "false";
        }
        tempArray.push(tempObj);
        tempObj = {};
      }

      setTableBodyData(tempArray);
    }
  }, [allUsersPermission, allPermission, userOption]);

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

export default PagePermissionDashboard;
