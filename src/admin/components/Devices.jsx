import React from "react";
import "../index.css";
import { MdDevices } from "react-icons/md";
import DashboardCTitle from "../common/DashboardCTitle";

const Devices = () => {
  return (
    <div
      className="dashboard_main_section_container"
      data-aos="zoom-in"
      data-aos-duration="300"
      data-aos-once="true"
    >
      <DashboardCTitle title={"Devices"} icon={<MdDevices />} />
    </div>
  );
};

export default Devices;
