import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { IoMdSave } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/UniversalLoader";
import { toast } from "react-toastify";
import { handleToggleAdminCred } from "../../redux/slices/MailiboxSlice";

const DashboardCTitle = ({ title, icon, from, mailCred }) => {
  const [data, setData] = useState({
    email: "",
    appPassword: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (mailCred) {
      setData({
        email: mailCred.email || "",
        appPassword: mailCred.appPassword || "",
      });
    }
  }, [mailCred]);

  const handleSave = async () => {
    if (
      data.email.length > 1 &&
      data.email.endsWith("@gmail.com") &&
      data.appPassword.length > 1
    ) {
      dispatch(setLoading(true));
      try {
        await axios.post(
          `http://localhost:5000/api/v1/supportmail/mailCred`,
          data
        );
        dispatch(setLoading(false));
        toast.success("Successfully saved!");
      } catch (error) {
        dispatch(setLoading(false));
        toast.error("Something went wrong!");
      }
    } else {
      toast.warning("Both fields are required and check email format!");
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (from === "dashBoardMail") {
    return (
      <div className="mail_header_cred_set_container">
        <h2 className="dashboard_main_mail_section_title">
          {icon} {title}
        </h2>
        <div className="mail_header_cred_set_fields_container">
          <div className="mail_header_cred_set_fields_btn_link">
            <button onClick={() => dispatch(handleToggleAdminCred(true))}>
              Admin Email Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <h2 className="dashboard_main_section_title">
      {icon} {title}
    </h2>
  );
};

export default DashboardCTitle;
