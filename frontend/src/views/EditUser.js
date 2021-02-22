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
  const [addableProjectData, setAddableProjectData] = useState([]);
  const [allocatedProjectData, setAllocatedProjectData] = useState([]);

  const [userOption, setUserOption] = useState([]);
  const [addableProjectOption, setAddableProjectOption] = useState([]);
  const [allocatedProjectOption, setAllocatedProjectOption] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [addableSelectedProject, setAddableSelectedProject] = useState([]);
  const [allocatedSelectedProject, setAllocatedSelectedProject] = useState([]);

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
    if (Object.entries(addableProjectData).length > 0) {
      setAddableProjectOption(createProjectIDArray(addableProjectData));
    } else {
      setAddableProjectOption([]);
    }
  }, [addableProjectData]);

  useEffect(() => {
    /*
      If fetched addable projects are more than 0, then display them as options.
      If it is 0, then it is either API is not working or there are no more projects which can be added to this user.
    */
    if (Object.entries(allocatedProjectData).length > 0) {
      setAllocatedProjectOption(createProjectIDArray(allocatedProjectData));
    } else {
      setAllocatedProjectOption([]);
    }
  }, [allocatedProjectData]);

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
        setAddableSelectedProject([]);
        setAllocatedSelectedProject([]);
        try {
          const token = await getTokenSilently();

          await Promise.all([
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.MIDDLEWARE_API_ROUTE_GET_ADDABLE_PROJECT +
                `?user_id=${selectedUser.value}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.MIDDLEWARE_API_ROUTE_GET_ALLOCATED_PROJECT +
                `?user_id=${selectedUser.value}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: signal,
              }
            ),
          ])

            .then(handleErrors)
            .then(async ([addableProjects, allocatedProjects]) => {
              const addableProjectData = await addableProjects.json();
              const allocatedProjectData = await allocatedProjects.json();

              setAddableProjectData(addableProjectData);
              setAllocatedProjectData(allocatedProjectData);
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
              project_info: addableSelectedProject,
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
      Object.entries(selectedUser).length > 0 &&
      addableSelectedProject.length > 0
    );
  };

  const submitJob = () => {
    setAllocateClick(uuidv4());
    setModal(true);
  };

  useEffect(() => {
    // Reset the select field after the modal is closed.
    if (modal === false && setAllocateClick !== null) {
      setAddableSelectedProject([]);
      setSelectedUser([]);
    }
  }, [modal]);

  const bodyText = () => {
    let bodyString = `Successfully added the following projects:\n\n`;

    for (let i = 0; i < addableSelectedProject.length; i++) {
      bodyString += `${i + 1}: ${addableSelectedProject[i].label}\n`;
    }

    bodyString += `\nto ${selectedUser.label}`;

    return bodyString;
  };

  return (
    <div className="container">
      <div className="row justify-content-lg-center">
        <div className="col-lg-6">
          <h4>Choose a user</h4>
          <Select
            id="available-users"
            onChange={(value) => setSelectedUser(value || [])}
            value={selectedUser}
            options={userOption}
          />
        </div>
      </div>
      <div className="row justify-content-lg-center">
        <div className="col-lg-6">
          <h4>Allocated Projects</h4>
          <Select
            id="allocated-projects"
            onChange={(value) => setAllocatedSelectedProject(value || [])}
            value={allocatedSelectedProject}
            options={allocatedProjectOption}
            isMulti
            closeMenuOnSelect={false}
          />
        </div>

        <div className="col-lg-6">
          <h4>Addable Projects</h4>
          <Select
            id="available-projects"
            onChange={(value) => setAddableSelectedProject(value || [])}
            value={addableSelectedProject}
            options={addableProjectOption}
            isMulti
            closeMenuOnSelect={false}
          />
        </div>
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
  );
};

export default EditUser;
