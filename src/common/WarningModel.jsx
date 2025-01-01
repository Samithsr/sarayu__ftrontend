import React from "react";
import "./style.css";
import { handleWarningModel } from "../redux/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const WarningModel = () => {
  const { user } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(handleWarningModel());
    navigate("/logout");
  };
  const handleCloseModel = () => {
    dispatch(handleWarningModel());
  };
  return (
    <div
      style={{ zIndex: "999999999" }}
      data-aos="fade-out"
      data-aos-duration="300"
      data-aos-once="true"
      className="logout_warning_model_container"
    >
      <div className="_card">
        <div className="_header">
          <div className="_image">
            <svg
              aria-hidden="true"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
          <div className="_content">
            <span className="_title">Logout account ({user.email})</span>
            <p className="_message">Are you sure, you want to logout?</p>
          </div>
          <div className="_actions">
            <button
              className="_desactivate"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="_cancel"
              type="button"
              onClick={handleCloseModel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModel;
