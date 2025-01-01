import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import RoutersDom from "./routers/RoutersDom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/slices/UserSlice";
import WarningModel from "./common/WarningModel";
import Loading from "./common/Loading";
import { toast, ToastContainer } from "react-toastify";
import setAuthToken from "./setAuthToken";
import { setLoading } from "./redux/slices/UniversalLoader";
import { setUserDetails } from "./redux/slices/UserDetailsSlice";
import { Navigate } from "react-router-dom";
import apiClient from "./api/apiClient";
import { interval } from "date-fns";
import { setTopicData } from "./redux/slices/EmployeeTopicDataSlice";

if (localStorage.getItem("token")) {
  setAuthToken(localStorage.getItem("token"));
}

const App = () => {
  const [userLocal, setUserLocal] = useState({});
  const { logoutToggle } = useSelector((state) => state.userSlice);
  const { loading } = useSelector((state) => state.UniversalLoader);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  useEffect(() => {
    if (user?.role !== "admin") {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          window.location.reload();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [user?.role]);

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    try {
      const jwtUser = jwtDecode(jwt);
      if (Date.now() >= jwtUser.exp * 1000) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        setUserLocal(jwtUser);
        dispatch(setUser(jwtUser));
      }
    } catch (error) {}
  }, []);
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="App">
      <ToastContainer autoClose={1500} />
      {loading && <Loading />}
      {logoutToggle && <WarningModel />}
      <RoutersDom />
    </div>
  );
};
export default App;
