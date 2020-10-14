import React, { useState } from "react";
import axios from "axios";
import { CORE_API_BASE_URL } from "constants/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DownloadButton = ({ downloadURL, downloadToken, fileName, disabled }) => {
  const [downloadButtonLabel, setDownloadButtonLabel] = useState(
    <FontAwesomeIcon icon="download" className="mr-3" />
  );

  const downloadData = () => {
    setDownloadButtonLabel(
      <FontAwesomeIcon icon="spinner" className="mr-3" spin />
    );

    axios({
      url: CORE_API_BASE_URL + downloadURL + downloadToken,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      setDownloadButtonLabel(
        <FontAwesomeIcon icon="download" className="mr-3" />
      );
    });
  };

  return (
    <button
      className="download-button btn btn-primary"
      disabled={disabled}
      onClick={() => {
        downloadData();
      }}
    >
      {downloadButtonLabel}
      Download Data
    </button>
  );
};

export default DownloadButton;
