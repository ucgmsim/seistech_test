import React, { useState, useEffect } from "react";

import "assets/style/Messages.css";

const GuideMessage = ({ header, body, instruction }) => {
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    if (instruction) {
      setInstructions(instruction);
    }
  }, [instruction]);

  return (
    <div className="card text-black bg-warning mb-3 card-message">
      <div className="card-header">{header}</div>
      <div className="card-body">
        <h5 className="card-title">{body}</h5>

        <ol>
          {instructions.map((value, index) => {
            return <li key={index}>{value}</li>;
          })}
        </ol>
      </div>
    </div>
  );
};

export default GuideMessage;
