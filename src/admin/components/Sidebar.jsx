import React, { useEffect, useState } from "react";
import "../index.css";
import { GrLogout } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { MdAdminPanelSettings } from "react-icons/md";
import { handleWarningModel } from "../../redux/slices/UserSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const oldActiveBtn = sessionStorage.getItem("admin_active_btn");
  const [activeNavBtn, setActiveNavBtn] = useState(
    oldActiveBtn || "admin_dashboard"
  );
  useEffect(() => {
    sessionStorage.setItem("admin_active_btn", activeNavBtn);
  }, [activeNavBtn]);
  const handleLogout = () => {
    dispatch(handleWarningModel());
  };
  return (
    <div className="sidebar_container">
      <div>
        <h4>
          <MdAdminPanelSettings color="orange" /> SARAYU INFOTECH SOLUTIONS
        </h4>
      </div>
      <div>
        <p
          className={
            activeNavBtn === "admin_dashboard" &&
            "admin_sidebar_container_nav_buttons_active"
          }
          onClick={() => [
            navigate("/dashboard/dashboard"),
            setActiveNavBtn("admin_dashboard"),
          ]}
        >
          Dashboard
        </p>
        <p
          className={
            activeNavBtn === "admin_tagcreation" &&
            "admin_sidebar_container_nav_buttons_active"
          }
          onClick={() => [
            navigate("/dashboard/tagcreation"),
            setActiveNavBtn("admin_tagcreation"),
          ]}
        >
          Tag creation
        </p>
        <p
          className={
            activeNavBtn === "admin_users" &&
            "admin_sidebar_container_nav_buttons_active"
          }
          onClick={() => [
            navigate("/dashboard/users"),
            setActiveNavBtn("admin_users"),
          ]}
        >
          Users
        </p>
        <p
          className={
            activeNavBtn === "admin_inbox" &&
            "admin_sidebar_container_nav_buttons_active"
          }
          onClick={() => [
            navigate("/dashboard/inbox"),
            setActiveNavBtn("admin_inbox"),
          ]}
        >
          Inbox
        </p>
      </div>
      <div>
        <button className="admin_navbar_logout_btn" onClick={handleLogout}>
          <GrLogout />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
