import React from "react";
import "../index.css";
import { Outlet } from "react-router-dom";

const MainSection = () => {
  return (
    <div className="admin_mainSection_container">
      <Outlet />
    </div>
  );
};

export default MainSection;
