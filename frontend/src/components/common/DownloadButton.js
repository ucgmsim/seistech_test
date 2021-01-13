import React, { useState } from "react";
import { useAuth0 } from "components/common/ReactAuth0SPA";
import { CORE_API_BASE_URL } from "constants/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleErrors } from "utils/Utils";
import axios from "axios";

const DownloadButton = ({
  downloadURL,
  downloadToken,
  extraParams,
  fileName,
  disabled,
}) => {
  // extraParams are used to record to our DB to track the users activity.

  const { getTokenSilently } = useAuth0();

  const [downloadButtonLabel, setDownloadButtonLabel] = useState({
    icon: <FontAwesomeIcon icon="download" className="mr-3" />,
    isFetching: false,
  });

  const downloadData = async () => {
    const token = await getTokenSilently();
    setDownloadButtonLabel({
      icon: <FontAwesomeIcon icon="spinner" className="mr-3" spin />,
      isFetching: true,
    });

    let queryString = "?";

    // downloadToken is now an object form
    for (const [param, value] of Object.entries(downloadToken)) {
      queryString += `${param}=${value}&`;
    }

    // These will be used to record download data activity
    for (const [param, value] of Object.entries(extraParams)) {
      queryString += `${param}=${value}&`;
    }

    // remove the last character which is an extra &
    queryString.slice(0, -1);

    axios({
      url: CORE_API_BASE_URL + downloadURL + queryString,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      responseType: "blob",
    })
      .then(handleErrors)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        setDownloadButtonLabel({
          icon: <FontAwesomeIcon icon="download" className="mr-3" />,
          isFetching: false,
        });
      })
      .catch((error) => {
        // Later on, maybe can add Modal to tell users an error msg.
        setDownloadButtonLabel({
          icon: <FontAwesomeIcon icon="download" className="mr-3" />,
          isFetching: false,
        });
        console.log(error);
      });
  };

  return (
    <button
      className="download-button btn btn-primary"
      disabled={disabled || downloadButtonLabel.isFetching === true}
      onClick={() => {
        downloadData();
      }}
    >
      {downloadButtonLabel.icon}
      Download Data
    </button>
  );
};

export default DownloadButton;
