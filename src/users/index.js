import React from "react";
import Navbar from "./navbar/Navbar";
import Body from "./body/Body";
import "./style.css";

const index = () => {
  return (
    <div className="users_main_container">
      <div className="users_navbar_main_container">
        <Navbar />
      </div>
      <div className="users_body_main_container">
        <Body />
      </div>
    </div>
  );
};

export default index;
