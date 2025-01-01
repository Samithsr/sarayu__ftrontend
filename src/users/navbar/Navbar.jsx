import React, { useEffect, useState } from "react";
import "./Navbar.css";
import "../style.css";
import { handleWarningModel } from "../../redux/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { handlToggleMenu } from "../../redux/slices/NavbarSlice";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { PiBuildingOfficeBold } from "react-icons/pi";
import ChangePassword from "./../body/components/ChangePassword";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const { showMenu } = useSelector((state) => state.NavBarSlice);
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const [changePasswordModel, setChangePasswordModel] = useState(false);

  useEffect(() => {
    if (user.id) {
      fetchUserDetails();
    }
  }, [user.id]);

  const fetchUserDetails = async () => {
    setLocalLoading(true);
    try {
      const res = await apiClient.get(`/auth/${user.role}/${user.id}`);
      setLoggedInUser(res?.data?.data);
      setLocalLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setLocalLoading(false);
    }
  };

  return (
    <>
      <div className="users_navbar_container">
        <div className="users_navbar_user_details">
          <p>
            <PiBuildingOfficeBold /> {loggedInUser?.company?.name}
          </p>
        </div>
        <div>
          <NavLink className={"users_navbar_link"} to={"/allusers/dashboard"}>
            Dashboard
          </NavLink>
          <div className="users_navbar_link_separator"></div>
          <NavLink className={"users_navbar_link"} to={"/allusers/graphs"}>
            Graphs
          </NavLink>
          <div className="users_navbar_link_separator"></div>
          <NavLink className={"users_navbar_link"} to={"/allusers/favorites"}>
            Watch list
          </NavLink>
          <div className="users_navbar_link_separator"></div>
          <NavLink
            className={"users_navbar_link"}
            to={"/allusers/digitalmeter"}
          >
            Digital meter
          </NavLink>
          {user.role === "supervisor" && (
            <>
              <div className="users_navbar_link_separator"></div>
              <NavLink className={"users_navbar_link"} to={"/allusers/users"}>
                Users
              </NavLink>{" "}
            </>
          )}
          <div className="users_navbar_link_separator"></div>
          <Link
            className={"users_navbar_link"}
            onClick={() => setChangePasswordModel(true)}
          >
            Change password
          </Link>
          <div className="users_navbar_link_separator"></div>
          <Link
            className="users_navbar_link"
            onClick={() => dispatch(handleWarningModel())}
          >
            Logout
          </Link>
        </div>

        <div className="users_navbar_user_details">
          <p>
            <FaUserCheck /> {user.name}
          </p>
        </div>
      </div>
      <div className="users_mobile_navbar_container">
        <div className="users_mobile_navbar_left">
          <PiBuildingOfficeBold /> {loggedInUser?.company?.name}
        </div>
        <div
          className="users_mobile_navbar_right"
          onClick={() => dispatch(handlToggleMenu())}
        >
          {showMenu ? <IoClose /> : <IoMdMenu />}
        </div>
        {showMenu && (
          <div
            className="users_mobile_navbar_show_menu"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-once="true"
          >
            <NavLink
              className={"users_mobile_navbar_show_menu_navlink"}
              to={"/allusers/dashboard"}
              onClick={() => dispatch(handlToggleMenu(false))}
            >
              Dashbaord
            </NavLink>
            <NavLink
              className={"users_mobile_navbar_show_menu_navlink"}
              to={"/allusers/graphs"}
              onClick={() => dispatch(handlToggleMenu(false))}
            >
              Graphs
            </NavLink>
            <NavLink
              className={"users_mobile_navbar_show_menu_navlink"}
              to={"/allusers/favorites"}
              onClick={() => dispatch(handlToggleMenu(false))}
            >
              Watch list
            </NavLink>
            <NavLink
              className={"users_mobile_navbar_show_menu_navlink"}
              to={"/allusers/digitalmeter"}
              onClick={() => dispatch(handlToggleMenu(false))}
            >
              Digital meter
            </NavLink>
            {user?.role !== "employee" && (
              <NavLink
                className={"users_mobile_navbar_show_menu_navlink"}
                to={"/allusers/users"}
                onClick={() => dispatch(handlToggleMenu(false))}
              >
                Users
              </NavLink>
            )}
            <Link
              className={"users_mobile_navbar_show_menu_navlink"}
              onClick={() => setChangePasswordModel(true)}
            >
              Change password
            </Link>
            <div
              className="users_mobile_navbar_show_menu_logout_container"
              onClick={() => dispatch(handleWarningModel())}
            >
              <button>
                <IoIosLogOut /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
      {changePasswordModel && (
        <ChangePassword
          user={user}
          setChangePasswordModel={setChangePasswordModel}
        />
      )}
    </>
  );
};

export default Navbar;
