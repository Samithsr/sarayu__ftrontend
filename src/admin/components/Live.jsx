import React from "react";
import "../index.css";
import { IoLocationSharp } from "react-icons/io5";
import DashboardCTitle from "./../common/DashboardCTitle";

const Live = () => {
  return (
    <div
      className="dashboard_main_section_container"
      data-aos="zoom-in"
      data-aos-duration="300"
      data-aos-once="true"
    >
      <DashboardCTitle title={"Live"} icon={<IoLocationSharp />} />
    </div>
  );
};

export default Live;
