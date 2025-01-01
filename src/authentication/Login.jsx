import React, { useEffect, useState } from "react";
import "./Login.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import LoginLeft from "./common/LoginLeft";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/slices/UserDetailsSlice";
import apiClient from "../api/apiClient";

const Login = () => {
  const [count, setCount] = useState(1);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    if (loginError?.length > 0) {
      setLoginError("");
    }
    setError({
      email: "",
      password: "",
      role: "",
    });
    setLoginError("");
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError({
      email: "",
      password: "",
      role: "",
    });
    setLoginError("");
  };
  useEffect(() => {
    setError({
      email: "",
      password: "",
    });
  }, [count]);

  const handleNext = () => {
    const errors = { ...error };
    if (!data?.email?.endsWith("@gmail.com")) {
      errors.email = "Please enter a valid email address.";
    }
    if (role === "" || role === "default") {
      errors.role = "Please select a role.";
    } else {
      errors.role = "";
    }
    setError(errors);
    if (
      count < 2 &&
      errors.email === "" &&
      errors.role === "" &&
      data?.email?.endsWith("@gmail.com") &&
      role !== ""
    ) {
      setCount((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    } else {
      setCount(count);
    }
  };

  const handleSubmit = async () => {
    if (data?.password?.length < 8) {
      setError({
        ...error,
        password: "Password must be at least 8 characters.",
      });
    } else {
      try {
        const res = await apiClient.post(`/auth/${role}/login`, data);
        localStorage.setItem("token", res?.data?.token);
        {
          role === "admin"
            ? (window.location = "/dashboard/dashboard")
            : (window.location = "/allusers/dashboard");
        }
      } catch (error) {
        setLoginError(error?.response?.data?.error);
      }
    }
  };

  return (
    <div className="row" id="login">
      <LoginLeft />
      <div className="col-12 col-md-6 login_right">
        <div className="two_step_form">
          <div className="login_dots_container">
            <div className="dot active_dot" onClick={handlePrev}>
              <span>
                {count === 1 ? (
                  "1"
                ) : (
                  <FaCheck style={{ marginBottom: "4px" }} />
                )}
              </span>
            </div>
            <div className={`line ${count === 2 && "active_line"}`}></div>
            <div
              className={`dot ${count === 2 && "active_dot"}`}
              onClick={handleNext}
            >
              <span>2</span>
            </div>
          </div>
          <h2 className="text-center mb-4 signin_title">Login</h2>
          <section className="form_feilds_container">
            {count === 1 ? (
              <>
                <div className="login_inputContainer">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {error?.email?.length > 0 && (
                    <em className="error">{error.email}</em>
                  )}
                </div>
                <div className="login_inputContainer mt-2">
                  <label htmlFor="role">Role</label>
                  <select
                    name="role"
                    value={role}
                    onChange={handleRoleChange}
                    id="role"
                  >
                    <option value="">Select...</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="employee">Operator</option>
                  </select>
                  {error?.role?.length > 0 && (
                    <em className="error">{error.role}</em>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="login_inputContainer">
                  <label htmlFor="password">Password</label>
                  <input
                    name="password"
                    value={data.password}
                    type="password"
                    id="password"
                    onChange={handleChange}
                    placeholder="Enter your Password"
                  />
                  {error?.password?.length > 0 && (
                    <em className="error">{error.password}</em>
                  )}
                </div>
              </>
            )}
            <div className="error_container">
              {loginError?.length > 0 && (
                <em className="error">{loginError}</em>
              )}
            </div>
            <div className="login_btn_container">
              <button
                disabled={count === 1 && true}
                onClick={handlePrev}
                className="login_prev_btn"
              >
                <IoIosArrowBack style={{ marginTop: "3px" }} /> Prev
              </button>
              {count === 1 ? (
                <button className="login_next_btn" onClick={handleNext}>
                  Next <IoIosArrowForward style={{ marginTop: "3px" }} />
                </button>
              ) : (
                <button className="login_next_btn" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </section>
          <hr className="mt-4" />
          <div className="login_contact_support">
            <p>
              Have some problems? Please{" "}
              <span
                className="contact_support_link"
                onClick={() => navigate("/contactSupport")}
              >
                contact support
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
