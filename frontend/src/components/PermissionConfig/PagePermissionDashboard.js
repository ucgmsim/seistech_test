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

  const [allGrantedPermission, setAllGrantedPermission] = useState({});
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
            CONSTANTS.MIDDLEWARE_API_ROUTE_GET_ALL_PERMISSION,
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
            setAllPermission(responseData["all_permission"]);
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
    Create an array of objects to set the table's header
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
    Pull every row from Granted_permission table
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAllGrantedPermission = async () => {
      try {
        const token = await getTokenSilently();

        await fetch(
          CONSTANTS.CORE_API_BASE_URL +
            CONSTANTS.MIDDLEWARE_API_ROUTE_GET_ALL_GRANTED_PERMISSION,
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
            setAllGrantedPermission(responseData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getAllGrantedPermission();

    return () => {
      abortController.abort();
    };
  }, []);

  /*
    Create an array of objects for table body
    We need to be sure that the following data aren't empty
    1. allGrantedPermission -> Data from UserDB, Granted_Permission table
    2. allPermission -> Data from UserDB, All permission we provide
    3. userOption -> Data from Auth0, existing users
  */
  useEffect(() => {
    if (
      (allGrantedPermission &&
        Object.keys(allGrantedPermission).length === 0 &&
        allGrantedPermission.constructor === Object) ===
        false > 0 &&
      allPermission.length > 0 &&
      userOption.length > 0
    ) {
      let tempArray = [];
      let tempObj = {};

      /*
      Loop through the object, allGrantedPermission
      Nested loop through array, allPermission

      The key for a temp object property with "auth0-user-id", 
      is user-email. (using find function to find an object with auth0-id value
      This object is in the format of
      {value: auth0-id, label: email | auth0 or google auth}
      Then from a found object, use the label as we want email to be displayed

      Then, compare if user's granted_permission (Auth0 access permission),
      contains the permission we provide, then it's true else false.
      )
    */
      for (const [user_id, Granted_permission] of Object.entries(
        allGrantedPermission
      )) {
        for (let i = 0; i < allPermission.length; i++) {
          tempObj["auth0-user-id"] = userOption.find(
            (user) => user.value === user_id
          ).label;

          tempObj[allPermission[i]] = Granted_permission.includes(
            allPermission[i]
          )
            ? "true"
            : "false";
        }
        tempArray.push(tempObj);
        tempObj = {};
      }

      setTableBodyData(tempArray);
    }
  }, [allGrantedPermission, allPermission, userOption]);

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

export default PagePermissionDashboard;
