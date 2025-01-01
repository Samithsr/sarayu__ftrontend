import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="_loader_container">
      <div className="_loader">
        <div className="_loader__bar"></div>
        <div className="_loader__bar"></div>
        <div className="_loader__bar"></div>
        <div className="_loader__bar"></div>
        <div className="_loader__bar"></div>
        <div className="_loader__ball"></div>
      </div>
    </div>
  );
};

export default Loader;
