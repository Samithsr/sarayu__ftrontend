import React from "react";
import "./Body.css";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handlToggleMenu } from "../../redux/slices/NavbarSlice";

const Body = () => {
  const dispatch = useDispatch();
  return (
    <div
      className="users_body_container"
      onClick={() => dispatch(handlToggleMenu(false))}
    >
      <div className="users_body_second_container">
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
