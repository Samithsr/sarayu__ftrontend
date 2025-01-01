import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/slices/UniversalLoader";
import apiClient from "../../../api/apiClient";
import { setUserDetails } from "../../../redux/slices/UserDetailsSlice";
import { toast } from "react-toastify";
import SmallGraph from "../graphs/smallgraph/SmallGraph";
import "../../style.css";
import { FaRegEye } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Loader from "../../loader/Loader";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const [loggedInUser, setLoggedInUser] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

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
      dispatch(setUserDetails(res?.data?.data));
      setLocalLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setLocalLoading(false);
    }
  };

  if (localLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="users_small_graphs_primary_container">
        {loggedInUser?.topics?.map((item, index) => {
          return (
            <div key={index} className="users_small_graphs_secondary_container">
              <div className="users_graphs_view_edit_icon_container">
                <div
                  onClick={() => {
                    const encodePrams = encodeURIComponent(item);
                    navigate(`/allusers/viewsinglegraph/${encodePrams}`);
                  }}
                >
                  <FaRegEye />
                </div>
                <div
                  onClick={() => {
                    const encodeParams = encodeURIComponent(item);
                    navigate(`/allusers/editsinglegraph/${encodeParams}`);
                  }}
                >
                  <FiEdit2 />
                </div>
              </div>
              <div className="users_graphs_topic_name">
                <p>{item?.split("/")[2]}</p>
              </div>
              <SmallGraph topic={item} height={220} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
