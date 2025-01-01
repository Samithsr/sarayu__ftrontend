import React, { useState } from "react";
import "../../style.css";
import { TbPasswordUser } from "react-icons/tb";
import { toast } from "react-toastify";
import apiClient from "../../../api/apiClient";

const ChangePassword = ({ setChangePasswordModel, user }) => {
  const [data, setData] = useState({
    email: user?.email,
    activePassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setError("");
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (data.activePassword.length < 8 || data.newPassword.length < 8) {
      setError("Password must contain at least 8 characters");
    } else {
      try {
        await apiClient.post(`/auth/${user.role}/reset-password`, data);
        toast.success("Password changed successfully");
        setChangePasswordModel(false);
      } catch (error) {
        setError(error?.response?.data?.error);
      }
    }
  };
  console.log(data);
  return (
    <div
      className="allusers_change_password_container"
      data-aos="fade-out"
      data-aos-duration="300"
      data-aos-once="true"
    >
      <div>
        <div className="allusers_change_password_logo_container">
          <div>
            <TbPasswordUser size={"80"} />
          </div>
        </div>
        <p>Change password</p>
        <div className="allusers_change_password_input_container">
          <label htmlFor="activePassword">Enter your active password</label>
          <input
            type="password"
            value={data.activePassword}
            onChange={handleInputChange}
            name="activePassword"
            id="activePassword"
            placeholder="Enter here"
          />
        </div>
        <div className="allusers_change_password_input_container">
          <label htmlFor="newPassword">Enter your new password</label>
          <input
            type="password"
            value={data.newPassword}
            onChange={handleInputChange}
            name="newPassword"
            id="newPassword"
            placeholder="Enter here"
          />
        </div>
        {error.length > 0 && (
          <span style={{ color: "red" }} className="text-center">
            {error}
          </span>
        )}
        <div className="allusers_change_password_button_container">
          <button onClick={handleChangePassword}>Save changes</button>
          <button onClick={() => setChangePasswordModel(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
