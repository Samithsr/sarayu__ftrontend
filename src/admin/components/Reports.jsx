import React from "react";
import "../index.css";
import { BiSolidReport } from "react-icons/bi";
import DashboardCTitle from "../common/DashboardCTitle";

const Reports = () => {
  return (
    <div
      className="dashboard_main_section_container"
      data-aos="zoom-in"
      data-aos-duration="300"
      data-aos-once="true"
    >
      <DashboardCTitle title={"Reports"} icon={<BiSolidReport />} />
    </div>
  );
};

export default Reports;
