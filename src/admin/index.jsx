import React from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import MainSection from "./components/MainSection";

const Admin = () => {
  return (
    <div className="admin_container">
      <Sidebar />
      <MainSection />
    </div>
  );
};

export default Admin;
