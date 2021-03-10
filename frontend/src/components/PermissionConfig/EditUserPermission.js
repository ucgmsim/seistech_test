import React, { useState, useEffect } from "react";

import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

import { useAuth0 } from "components/common/ReactAuth0SPA";
import * as CONSTANTS from "constants/Constants";

import { ModalComponent } from "components/common";
import { handleErrors, createProjectIDArray } from "utils/Utils";

const EditUserPermission = () => {
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

  const [userDataFetching, setUserDataFetching] = useState(false);
  const [projectDataFetching, setProjectDataFetching] = useState(false);

  const [alocateClick, setAllocateClick] = useState(null);
  const [addableStatusText, setAddableStatusText] = useState(
    "Allocate Project"
  );

  const [removeClick, setRemoveClick] = useState(null);
  const [allocatedStatusText, setAllocatedStatusText] = useState(
    "Remove Project"
  );

  const [addModal, setAddModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);

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

        setUserDataFetching(true);

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
            setUserDataFetching(false);
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

        setAddableProjectOption([]);
        setAllocatedProjectOption([]);

        setProjectDataFetching(true);

        try {
          const token = await getTokenSilently();

          await Promise.all([
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
            fetch(
              CONSTANTS.CORE_API_BASE_URL +
                CONSTANTS.INTERMEDIATE_API_USER_PROJECTS_ENDPOINT +
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
            .then(async ([allPrivateProjects, userProjects]) => {
              const allPrivateProjectsData = await allPrivateProjects.json();
              const userProjectsData = await userProjects.json();

              setAddableProjectData(
                filterToGetAddableProjects(
                  allPrivateProjectsData,
                  userProjectsData
                )
              );
              console.log(filterToGetAllowedProjects(userProjectsData));
              setAllocatedProjectData(
                filterToGetAllowedProjects(userProjectsData)
              );

              setProjectDataFetching(false);
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

    const allocateProjects = async () => {
      if (alocateClick !== null) {
        try {
          setAddableStatusText("Allocating...");
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
              CONSTANTS.INTERMEDIATE_API_USER_ALLOCATE_PROJECTS_ENDPOINT,
            requestOptions
          )
            .then(handleErrors)
            .then(async () => {
              setAddableStatusText("Allocate Project");
            })
            .catch((error) => {
              console.log(error);
              setAddableStatusText("Error occurred");
            });
        } catch (error) {
          console.log(error);
          setAddableStatusText("Error occurred");
        }
      }
    };

    allocateProjects();

    return () => {
      abortController.abort();
    };
  }, [alocateClick]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const removeProjects = async () => {
      if (removeClick !== null) {
        try {
          setAllocatedStatusText("Removing...");
          const token = await getTokenSilently();

          let requestOptions = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_info: selectedUser,
              project_info: allocatedSelectedProject,
            }),
            signal: signal,
          };

          await fetch(
            CONSTANTS.CORE_API_BASE_URL +
              CONSTANTS.INTERMEDIATE_API_USER_REMOVE_PROJECTS_ENDPOINT,
            requestOptions
          )
            .then(handleErrors)
            .then(async () => {
              setAllocatedStatusText("Removing...");
            })
            .catch((error) => {
              console.log(error);
              setAllocatedStatusText("Error occurred");
            });
        } catch (error) {
          console.log(error);
          setAllocatedStatusText("Error occurred");
        }
      }
    };

    removeProjects();

    return () => {
      abortController.abort();
    };
  }, [removeClick]);

  useEffect(() => {
    // Reset the select field after the modal is closed.
    if (addModal === false && setAllocateClick !== null) {
      setAddableSelectedProject([]);
      setAllocatedSelectedProject([]);
      setAddableProjectOption([]);
      setAllocatedProjectOption([]);
      setSelectedUser([]);
    }
  }, [addModal]);

  useEffect(() => {
    if (removeModal === false && setRemoveClick !== null) {
      setAddableSelectedProject([]);
      setAllocatedSelectedProject([]);
      setAddableProjectOption([]);
      setAllocatedProjectOption([]);
      setSelectedUser([]);
    }
  }, [removeModal]);

  const allocateProjects = () => {
    setAllocateClick(uuidv4());
    setAddModal(true);
  };

  const validAllocateSubmitBtn = () => {
    return (
      Object.entries(selectedUser).length > 0 &&
      addableSelectedProject.length > 0
    );
  };

  const removeProjects = () => {
    setRemoveClick(uuidv4());
    setRemoveModal(true);
  };

  const validRemoveProjectsBtn = () => {
    return (
      Object.entries(selectedUser).length > 0 &&
      allocatedSelectedProject.length > 0
    );
  };

  const addProjectsBodyText = () => {
    let bodyString = `Successfully added the following projects:\n\n`;

    for (let i = 0; i < addableSelectedProject.length; i++) {
      bodyString += `${i + 1}: ${addableSelectedProject[i].label}\n`;
    }

    bodyString += `\nto ${selectedUser.label}`;

    return bodyString;
  };

  const removeProjectsBodyText = () => {
    let bodyString = `Successfully removed the following projects:\n\n`;

    for (let i = 0; i < allocatedSelectedProject.length; i++) {
      bodyString += `${i + 1}: ${allocatedSelectedProject[i].label}\n`;
    }

    bodyString += `\nfrom ${selectedUser.label}`;

    return bodyString;
  };

  const filterToGetAddableProjects = (allPrivateProjects, userProjects) => {
    let tempObj = {};

    for (const [key, value] of Object.entries(allPrivateProjects)) {
      if (!Object.keys(userProjects).includes(key)) {
        tempObj[key] = value;
      }
    }

    return tempObj;
  };

  const filterToGetAllowedProjects = (userProjects) => {
    let tempObj = {};

    for (const [key, value] of Object.entries(userProjects)) {
      tempObj[key] = value;
    }

    return tempObj;
  };

  return (
    <div className="container">
      <div className="row justify-content-lg-center">
        <div className="col-lg-6 mb-5">
          <h4>Choose a user</h4>
          <Select
            id="available-users"
            onChange={(value) => setSelectedUser(value || [])}
            value={selectedUser}
            options={userOption}
            isDisabled={userDataFetching === true}
            placeholder={userDataFetching === true ? "Loading..." : "Select..."}
          />
        </div>
      </div>
      <div className="row justify-content-lg-center">
        <div className="col-lg-6">
          <h4>Allowed Private Projects</h4>
          <h5>(Use to remove projects from a user)</h5>
          <Select
            id="allocated-projects"
            onChange={(value) => setAllocatedSelectedProject(value || [])}
            value={allocatedSelectedProject}
            options={allocatedProjectOption}
            isMulti
            closeMenuOnSelect={false}
            isDisabled={allocatedProjectOption.length === 0}
            placeholder={
              selectedUser.length === 0
                ? "Please select a user first..."
                : selectedUser.length !== 0 &&
                  projectDataFetching === true &&
                  allocatedProjectOption.length === 0
                ? "Loading..."
                : selectedUser.length !== 0 &&
                  projectDataFetching === false &&
                  allocatedProjectOption.length === 0
                ? "No allocated projects"
                : selectedUser.length !== 0 &&
                  allocatedProjectOption.length !== 0
                ? "Select projects to remove"
                : "Something went wrong"
            }
          />
          <button
            id="remove-selected-projects-btn"
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => removeProjects()}
            disabled={!validRemoveProjectsBtn()}
          >
            {allocatedStatusText}
          </button>
        </div>

        <div className="col-lg-6">
          <h4>Addable Private Projects</h4>
          <h5>(Use to add projects to a user)</h5>
          <Select
            id="available-projects"
            onChange={(value) => setAddableSelectedProject(value || [])}
            value={addableSelectedProject}
            options={addableProjectOption}
            isMulti
            closeMenuOnSelect={false}
            isDisabled={addableProjectOption.length === 0}
            placeholder={
              selectedUser.length === 0
                ? "Please select a user first..."
                : selectedUser.length !== 0 &&
                  projectDataFetching === true &&
                  addableProjectOption.length === 0
                ? "Loading..."
                : selectedUser.length !== 0 &&
                  projectDataFetching === false &&
                  addableProjectOption.length === 0
                ? "No addable projects"
                : selectedUser.length !== 0 && addableProjectOption.length !== 0
                ? "Select projects to allocate"
                : "Something went wrong"
            }
          />
          <button
            id="allocate-user-submit-btn"
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => allocateProjects()}
            disabled={!validAllocateSubmitBtn()}
          >
            {addableStatusText}
          </button>
        </div>
      </div>

      <ModalComponent
        modal={addModal}
        setModal={setAddModal}
        title="Successfully added"
        body={addProjectsBodyText()}
      />

      <ModalComponent
        modal={removeModal}
        setModal={setRemoveModal}
        title="Successfully removed"
        body={removeProjectsBodyText()}
      />
    </div>
  );
};

export default EditUserPermission;
