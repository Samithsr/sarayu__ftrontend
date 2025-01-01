import React, { useEffect, useState } from "react";
import "../../style.css";
import { useSelector, useDispatch } from "react-redux";
import apiClient from "../../../api/apiClient";
import { setUserDetails } from "../../../redux/slices/UserDetailsSlice";
import { toast } from "react-toastify";
import Loader from "../../loader/Loader";
import LiveDataTd from "../common/LiveDataTd";
import { IoMdRemoveCircle } from "react-icons/io";
import { BiSolidReport } from "react-icons/bi";
import WeekTd from "../common/WeekTd";
import YestardayTd from "../common/YestardayTd";
import TodayTd from "../common/TodayTd";
import { VscGraph } from "react-icons/vsc";
import { FaDigitalOcean } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const [favoriteList, setFavoriteList] = useState([]);
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
      setFavoriteList(res?.data?.data?.favorites);
      setLocalLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setLocalLoading(false);
    }
  };

  const handleRemoveFavorite = async (topic) => {
    try {
      await apiClient.delete(`/auth/${user.role}/${user.id}/favorites`, {
        data: { topic },
      });
      setFavoriteList((prev) => prev.filter((fav) => fav !== topic));
      toast.success("Topic removed from watchlist");
      fetchUserDetails();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to remove topic from watchlist"
      );
    }
  };

  if (localLoading) {
    return <Loader />;
  }
  return (
    <div className="allusers_dashboard_main_container">
      <div className="alluser_alloperators_container">
        <div className="alluser_alloperators_scrollable-table">
          <table className="alluser_alloperators_table">
            <thead>
              <tr>
                <th style={{ background: "red" }}>Tag name</th>
                <th>Week's max</th>
                <th>Yesterday's max</th>
                <th>Today's max</th>
                <th className="allusers_dashboard_live_data_th">Live</th>
                <th>Unit</th>
                <th>Report</th>
                <th>Graph/Digital</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {loggedInUser?.favorites?.map((item, index) => (
                <tr key={index}>
                  <td style={{ background: "#34495e", color: "white" }}>
                    {item?.split("/")[2]}
                  </td>
                  <WeekTd topic={item} />
                  <YestardayTd topic={item} />
                  <TodayTd topic={item} />
                  <LiveDataTd topic={item} />
                  <td>V</td>
                  <td>
                    <BiSolidReport
                      onClick={() => {
                        const encodedTopic = encodeURIComponent(item);
                        navigate(`/allusers/report/${encodedTopic}`);
                      }}
                      size={"20"}
                      style={{ cursor: "pointer" }}
                      color="gray"
                    />
                  </td>
                  <td className="allusers_dashboard_graph_digital_td">
                    <button
                      onClick={() => {
                        const encodedTopic = encodeURIComponent(item);
                        navigate(`/allusers/viewsinglegraph/${encodedTopic}`);
                      }}
                    >
                      <VscGraph />
                    </button>
                    <button
                      onClick={() => {
                        const encodedTopic = encodeURIComponent(item);
                        navigate(
                          `/allusers/singledigitalmeter/${encodedTopic}/${user.role}/${user.id}`
                        );
                      }}
                    >
                      <FaDigitalOcean />
                    </button>
                  </td>
                  <td>
                    <IoMdRemoveCircle
                      color="red"
                      size={"20"}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveFavorite(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
