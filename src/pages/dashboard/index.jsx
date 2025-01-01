import React from "react";
import { useSelector } from "react-redux";
import Admin from "./../../admin/index";
import Users from "./../../users/index";

const Dashboard = () => {
  const { user } = useSelector((state) => state.userSlice);
  return <div>{user.role === "admin" ? <Admin /> : <Users />}</div>;
};

export default Dashboard;
