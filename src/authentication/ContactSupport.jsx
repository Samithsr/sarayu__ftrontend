import React, { useEffect, useState } from "react";
import "./ContactSupport.css";
import LoginLeft from "./common/LoginLeft";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    subject: "",
    description: "",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleSubmit = async () => {
    let newError = { ...error };

    if (!data.username) {
      newError.username = "Please enter your username";
    }
    if (!data.email) {
      newError.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newError.email = "Please enter a valid email address";
    }
    if (!data.subject) {
      newError.subject = "Please enter your subject";
    }
    if (data.description.length < 14) {
      newError.description = "Description should contain at least 14 words";
    }

    setError(newError);

    if (
      !newError.username &&
      !newError.email &&
      !newError.subject &&
      !newError.description
    ) {
      try {
        await apiClient.post("/supportmail", data);
        toast.success("Message sent successfully!");
        setData({
          username: "",
          email: "",
          subject: "",
          description: "",
        });
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="contact_support">
      <div className="row" id="row_contact_support">
        <LoginLeft />
        <div className="col-12 col-md-6 col_right_contact_support">
          <div className="contact_support_container">
            <h2 className="contact_support_title">Contact Support</h2>
            <section>
              <div className="login_inputContainer mt-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  value={data.username}
                  id="username"
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
                <div className="error_container">
                  {error.username && (
                    <em className="error">{error.username}</em>
                  )}
                </div>
              </div>
              <div className="login_inputContainer mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  value={data.email}
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                <div className="error_container">
                  {error.email && <em className="error">{error.email}</em>}
                </div>
              </div>
              <div className="login_inputContainer mt-3">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  value={data.subject}
                  id="subject"
                  name="subject"
                  onChange={handleChange}
                  placeholder="Enter your subject"
                />
                <div className="error_container">
                  {error.subject && <em className="error">{error.subject}</em>}
                </div>
              </div>
              <div className="login_inputContainer mt-3">
                <label htmlFor="description">Description</label>
                <textarea
                  value={data.description}
                  id="description"
                  name="description"
                  onChange={handleChange}
                  placeholder="Enter your description"
                />
                <div className="error_container">
                  {error.description && (
                    <em className="error">{error.description}</em>
                  )}
                </div>
              </div>
            </section>
            <div className="login_contact_support_submit my-4">
              <button onClick={handleSubmit}>Submit</button>
            </div>
            <hr className="mt-4" />
            <div className="login_contact_support_footer">
              <p>
                If there is no concern, continue to{" "}
                <span onClick={() => navigate("/")}>Login</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
