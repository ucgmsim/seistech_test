import React, { useState, useEffect } from "react";

import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

import { handleErrors, createProjectIDArray } from "utils/Utils";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

const EditUser = () => {
  const { getTokenSilently } = useAuth0();

  const [userData, setUserData] = useState({});
  const [projectData, setProjectData] = useState([]);

  const [userOption, setUserOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  const [statusText, setStatusText] = useState("Allocate Project");
  const [alocateClick, setAllocateClick] = useState(null);

  useEffect(() => {
    if (Object.entries(userData).length > 0) {
      setUserOption(createProjectIDArray(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (Object.entries(projectData).length > 0) {
      setProjectOption(createProjectIDArray(projectData));
    } else {
      setProjectOption([]);
    }
  }, [projectData]);

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
    Fetching projects that are not allocated to user.
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getProjectData = async () => {
      if (selectedUser.length != 0) {
        // Reset the selected option
        setSelectedProject([]);
        try {
          const token = await getTokenSilently();

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.MIDDLEWARE_API_ROUTE_GET_PROJECT +
              `?user_id=${selectedUser.value}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: signal,
            }
          )
            .then(handleErrors)
            .then(async (projects) => {
              const responseProjectData = await projects.json();

              setProjectData(responseProjectData);
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    getProjectData();

    return () => {
      abortController.abort();
    };
  }, [selectedUser]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const allocateUser = async () => {
      if (alocateClick !== null) {
        try {
          const token = await getTokenSilently();
          setStatusText("Allocating...");

          let requestOptions = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_info: selectedUser,
              project_info: selectedProject,
            }),
            signal: signal,
          };

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.MIDDLEWARE_API_ROUTE_ALLOCATE_PROJECTS_TO_USER,
            requestOptions
          )
            .then(handleErrors)
            .then(async (response) => {
              const responseData = await response.json();
              console.log(responseData);
              setStatusText("Allocate Project");
            })
            .catch((error) => {
              console.log(error);
              setStatusText("Error occurred");
            });
        } catch (error) {
          console.log(error);
          setStatusText("Error occurred");
        }
      }
    };

    allocateUser();

    return () => {
      abortController.abort();
    };
  }, [alocateClick]);

  const validSubmitBtn = () => {
    return (
      Object.entries(selectedUser).length > 0 && selectedProject.length > 0
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-lg-center">
        <div className="col-lg-6">
          <pre>User</pre>
          <Select
            id="available-users"
            onChange={(value) => setSelectedUser(value || [])}
            value={selectedUser}
            options={userOption}
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

        <button
          id="allocate-user-submit-btn"
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => setAllocateClick(uuidv4())}
          disabled={!validSubmitBtn()}
        >
          {statusText}
        </button>
      </div>
    </div>
  );
};

export default EditUser;
