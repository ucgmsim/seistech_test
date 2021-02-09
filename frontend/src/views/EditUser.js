import React, { useState, useEffect } from "react";

import Select from "react-select";

import {
  createSelectArray,
  handleErrors,
  createProjectIDArray,
} from "utils/Utils";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

const EditUser = () => {
  const { getTokenSilently } = useAuth0();

  const [userData, setUserData] = useState({});
  const [projectData, setProjectData] = useState([]);

  /*
    projectData would look like this
    {
      gnzl: {
        name: Generic New Zealand Location
      }
    }
    So using projectData to make a new projectObj that looks like
    {
      gnzl: Generic New Zealand Location
    }
    For a dropdown
  */
  const [projectObj, setProjectObj] = useState({});

  const [userOption, setUserOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  useEffect(() => {
    if (Object.entries(userData).length > 0) {
      setUserOption(createProjectIDArray(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (Object.entries(projectObj).length > 0) {
      setProjectOption(createProjectIDArray(projectObj));
    }
  }, [projectObj]);

  /*
    Fetching data from the API
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getDropdowns = async () => {
      try {
        const token = await getTokenSilently();

        await Promise.all([
          fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.MIDDLEWARE_API_ROUTE_GET_USER,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          ),
          fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.MIDDLEWARE_API_ROUTE_GET_PROJECT,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          ),
        ])
          .then(handleErrors)
          .then(async ([users, projects]) => {
            const responseUserData = await users.json();
            const responseProjectData = await projects.json();

            setUserData(responseUserData);
            setProjectData(responseProjectData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getDropdowns();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (projectData.length !== 0) {
      let tempObj = {};
      for (const [key, value] of Object.entries(projectData)) {
        tempObj[key] = value.name;
      }
      setProjectObj(tempObj);
    }
  }, [projectData]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <pre>User</pre>
          <Select
            id="available-users"
            onChange={(value) => setSelectedUser(value || [])}
            value={selectedUser}
            options={userOption}
            isMulti
            closeMenuOnSelect={false}
          />
        </div>
        <div className="col-lg-6">
          <pre>Project</pre>
          <Select
            id="available-projects"
            onChange={(value) => setSelectedProject(value || [])}
            value={selectedProject}
            options={projectOption}
            isMulti
            closeMenuOnSelect={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditUser;
