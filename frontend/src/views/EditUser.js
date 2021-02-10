import React, { useState, useEffect } from "react";

import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

import { handleErrors, createProjectIDArray } from "utils/Utils";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import ModalComponent from "components/common/ModalComponent";
import * as CONSTANTS from "constants/Constants";

const EditUser = () => {
  const { getTokenSilently } = useAuth0();

  const [userData, setUserData] = useState({});
  const [projectData, setProjectData] = useState([]);

  const [userOption, setUserOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  const [alocateClick, setAllocateClick] = useState(null);
  const [statusText, setStatusText] = useState("Allocate Project");

  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (Object.entries(userData).length > 0) {
      setUserOption(createProjectIDArray(userData));
    }
  }, [userData]);

  useEffect(() => {
    /*
      If fetched addable projects are more than 0, then display them as options.
      If it is 0, then it is either API is not working or there are no more projects which can be added to this user.
    */
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
    Addable projects
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getAddableProjectData = async () => {
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

    getAddableProjectData();

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
          setStatusText("Allocating...");
          const token = await getTokenSilently();

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
            .then(async () => {
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

  const submitJob = () => {
    setAllocateClick(uuidv4());
    setModal(true);
  };

  useEffect(() => {
    // Reset the select field after the modal is closed.
    if (modal === false && setAllocateClick !== null) {
      setSelectedProject([]);
      setSelectedUser([]);
    }
  }, [modal]);

  const bodyText = () => {
    let bodyString = `Successfully added the following projects:\n\n`;

    for (let i = 0; i < selectedProject.length; i++) {
      bodyString += `${i + 1}: ${selectedProject[i].label}\n`;
    }

    bodyString += `\nto ${selectedUser.label}`;

    return bodyString;
  };

  return (
    <div className="container">
      <div className="row justify-content-lg-center">
        <div className="col-lg-6">
          <h4>User</h4>
          <Select
            id="available-users"
            onChange={(value) => setSelectedUser(value || [])}
            value={selectedUser}
            options={userOption}
          />
        </div>
        <div className="col-lg-6">
          <h4>Project</h4>
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
          onClick={() => submitJob()}
          disabled={!validSubmitBtn()}
        >
          {statusText}
        </button>
        <ModalComponent
          modal={modal}
          setModal={setModal}
          title="Successfully added"
          body={bodyText()}
        />
      </div>
    </div>
  );
};

export default EditUser;
