import React, { useEffect, useState } from "react";
import "../../style.css";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import Loader from "../../loader/Loader";
import { FaRegBookmark } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { FaDigitalOcean } from "react-icons/fa";
import WeekTd from "../common/WeekTd";
import YestardayTd from "../common/YestardayTd";
import TodayTd from "../common/TodayTd";
import LiveDataTd from "../common/LiveDataTd";
import { BiSolidReport } from "react-icons/bi";
import { BsBookmarkStarFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const SingleUserDashBoard = () => {
  const { user } = useSelector((state) => state.userSlice);
  const [localLoading, setLocalLoading] = useState(false);
  const [singleUserData, setSingleUserData] = useState({});
  const { id } = useParams();
  const [favoriteList, setFavoriteList] = useState([]);
  const [supervisorId, setSupervisorId] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchSingleUser();
    }
  }, [id]);

  const fetchSingleUser = async () => {
    setLocalLoading(true);
    try {
      const res = await apiClient.get(`/auth/employee/${id}`);
      const data = res?.data?.data;
      setSingleUserData(data);
      setFavoriteList(data?.supervisor?.favorites || []);
      setSupervisorId(data?.supervisor?._id);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch user data");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddFavorite = async (topic) => {
    try {
      await apiClient.post(`/auth/${user.role}/${supervisorId}/favorites`, {
        topic,
      });
      setFavoriteList((prev) => [...prev, topic]);
      toast.success("Tagname to watchlist");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to add topic to watchlist"
      );
    }
  };

  const handleRemoveFavorite = async (topic) => {
    try {
      await apiClient.delete(`/auth/${user.role}/${supervisorId}/favorites`, {
        data: { topic },
      });
      setFavoriteList((prev) => prev.filter((fav) => fav !== topic));
      toast.success("Topic removed from watchlist");
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
    <div className="singleuserdashboard_main_container">
      <div>
        {singleUserData?.name} dashboard{" "}
        <span
          className="singleuserdashboard_close_icon"
          onClick={() => navigate("/allusers/users")}
        >
          <IoMdArrowBack color="red" size={"25"} />
        </span>
      </div>

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
                  <th>Watch List</th>
                </tr>
              </thead>
              <tbody>
                {singleUserData?.topics?.map((item, index) => (
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
                      <button>
                        <FaDigitalOcean />
                      </button>
                    </td>
                    <td>
                      {favoriteList?.includes(item) ? (
                        <BsBookmarkStarFill
                          color="green"
                          size={"20"}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveFavorite(item)}
                        />
                      ) : (
                        <FaRegBookmark
                          color="green"
                          size={"18"}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleAddFavorite(item)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserDashBoard;
