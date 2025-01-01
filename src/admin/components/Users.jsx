import React from "react";
import "../index.css";
import { FaUsersCog } from "react-icons/fa";
import DashboardCTitle from "../common/DashboardCTitle";
import { Outlet } from "react-router-dom";

const Users = () => {
  return (
    <div
      className="dashboard_main_section_container"
      data-aos="zoom-in"
      data-aos-duration="300"
      data-aos-once="true"
    >
      <DashboardCTitle title={"Users"} icon={<FaUsersCog />} />
      <Outlet />
    </div>
  );
};

export default Users;
