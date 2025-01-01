import React, { useState, useEffect } from "react";
import "./CircularProgressBar.css";

const CircularProgressBar = ({ percent, role }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter >= percent) {
          clearInterval(intervalId);
          return prevCounter;
        } else {
          return prevCounter + 1;
        }
      });
    }, 110);

    return () => clearInterval(intervalId);
  }, [percent]);

  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  let offset;
  offset = circumference - (counter / 1000) * circumference;

  return (
    <div className="admin_user_skill">
      <div className="admin_user_outer">
        <div className="admin_user_inner">
          {role === "manager" && <div id="number">{counter}</div>}
          {role === "supervisor" && <div id="number">{counter}</div>}
          {role === "operator" && <div id="number">{counter}</div>}
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="100px"
        height="100px"
        className="admin_progress_bar_svg"
      >
        <defs>
          <linearGradient id="GradientColor">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#673ab7" />
          </linearGradient>
        </defs>
        <circle
          cx="64"
          cy="36"
          r="25"
          strokeLinecap="round"
          stroke="url(#GradientColor)"
          strokeWidth="20"
          fill="none"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.2s ease",
          }}
        />
      </svg>
    </div>
  );
};

export default CircularProgressBar;
