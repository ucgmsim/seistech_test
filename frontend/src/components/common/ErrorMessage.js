import React from "react";
import {
  ERROR_MSG_HEADER,
  ERROR_MSG_TITLE,
  ERROR_MSG_BODY,
} from "constants/Constants";

import "assets/style/Messages.css";

const ErrorMessage = () => {
  return (
    <div className="card text-white bg-danger mb-3 card-message">
      <div className="card-header">{ERROR_MSG_HEADER}</div>
      <div className="card-body">
        <h5 className="card-title">{ERROR_MSG_TITLE}</h5>

        <p>{ERROR_MSG_BODY}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
