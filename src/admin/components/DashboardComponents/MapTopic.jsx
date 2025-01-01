import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import Loader from "./../../../users/loader/Loader";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { IoMdSpeedometer } from "react-icons/io";
import DigitalAssignModel from "./DigitalAssignModel";

const MapTopic = ({ setToggleAssignMeterModel }) => {
  const navigate = useNavigate();
  const { role, id } = useParams();
  const [fetchedUser, setFetchedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [allTagNames, setAllTagNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTagNames, setFilteredTagNames] = useState([]);
  const [selectedTagToAssign, setSelectedTagToAssign] = useState([]);
  const [topicMeterAssign, setTopicMeterAssign] = useState("");
  useEffect(() => {
    fetchSelectedUser();
    fetchAllTagNames();
  }, [id]);

  const fetchSelectedUser = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/auth/${role}/${id}`);
      setFetchedUser(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const fetchAllTagNames = async () => {
    try {
      const res = await apiClient("/mqtt/get-all-tagname");
      setAllTagNames(res.data.data);
      setFilteredTagNames(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSelectedTagToAssign = (tagname) => {
    if (selectedTagToAssign.includes(tagname)) {
      setSelectedTagToAssign((prev) => prev.filter((item) => item !== tagname));
    } else {
      setSelectedTagToAssign([...selectedTagToAssign, tagname]);
    }
  };

  const handleRemoveTagNameFromRecentList = async (tagname) => {
    setSelectedTagToAssign((prev) => prev.filter((item) => item !== tagname));
  };

  const handleAssignTagnames = async () => {
    try {
      await apiClient.post(`/auth/${role}/assign-topics/${id}`, {
        topics: selectedTagToAssign,
      });
      fetchSelectedUser();
      fetchAllTagNames();
      setSelectedTagToAssign([]);
      toast.success("Assigned successfully!");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteAssignedTagname = async (topic) => {
    try {
      await apiClient.put(`/auth/${role}/delete-topic/${id}`, { topic });
      toast.success(`${topic} removed successfully!`);
      fetchSelectedUser();
      fetchAllTagNames();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAllTagnameSearch = (e) => {
    setSearchQuery(e.target.value);
    setFilteredTagNames(
      allTagNames.filter((item) =>
        item.topic.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleAssignDegitalMeterModel = () => {
    setToggleAssignMeterModel(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="_admin_dashboard_maptopic_model">
      <div className="_admin_dashboard_maptopic_model_close">
        <span onClick={() => window.close()}>
          <IoCloseSharp size={"22"} style={{ cursor: "pointer" }} />
        </span>
      </div>
      <div className="_admin_maptopic_main_container">
        <div className="_admin_maptopic_left_container">
          <div className="_admin_maptopic_left_top_container">
            <header className="_admin_maptopic_left_top_overright_header">
              {fetchedUser?.email}{" "}
              <button
                onClick={handleAssignTagnames}
                disabled={selectedTagToAssign.length === 0}
              >
                Assign
              </button>
            </header>
            {selectedTagToAssign.length !== 0 ? (
              <div className="_admin_maptopic_left_top_topic_container">
                {selectedTagToAssign.map((item, index) => {
                  return (
                    <div key={index}>
                      <span>{item}</span>
                      <span
                        onClick={() => handleRemoveTagNameFromRecentList(item)}
                      >
                        <p>
                          <IoCloseSharp
                            color="white"
                            style={{ cursor: "pointer" }}
                          />
                        </p>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="_admin_maptopic_left_top_topic_alternative_message_container">
                <p>No topics selected...!</p>
              </div>
            )}
          </div>
          <div className="_admin_maptopic_left_bottom_container">
            <div className="_admin_maptopic_left_top_container">
              <header>Assigned TagNames</header>
              {fetchedUser?.topics?.length !== 0 ? (
                <div className="_admin_maptopic_left_top_topic_container">
                  {fetchedUser?.topics?.map((item, index) => {
                    return (
                      <div key={index}>
                        <span>{item}</span>
                        <span>
                          <p
                            onClick={() => {
                              const encodedTopic = encodeURIComponent(item);
                              window.open(
                                `/_dashboard/assignmetertotopic/${encodedTopic}/${id}/${role}`,
                                "_blank"
                              );
                            }}
                          >
                            <IoMdSpeedometer />
                          </p>
                          <p onClick={() => handleDeleteAssignedTagname(item)}>
                            <IoCloseSharp
                              color="white"
                              style={{ cursor: "pointer" }}
                            />
                          </p>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="_admin_maptopic_left_top_topic_alternative_message_container">
                  <p>No topics assigned...!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="_admin_maptopic_right_container">
          <header className="_admin_maptopic_right_overwright_header">
            <span>All TagNames</span>
            <div className="_admin_maptopic_right_overwright_header_input_container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleAllTagnameSearch}
                placeholder="Search By Tagname..."
              />
            </div>
          </header>
          <div>
            {filteredTagNames?.map((item, index) => {
              return (
                <div
                  onClick={() => handleSelectedTagToAssign(item?.topic)}
                  className={`_admin_maptopic_right_tagnames ${
                    selectedTagToAssign.includes(item?.topic) &&
                    "_admin_maptopic_right_active_tagnames"
                  } ${
                    fetchedUser?.topics?.includes(item?.topic) &&
                    "_admin_maptopic_right_active_tagnames"
                  }`}
                  key={item._id}
                >
                  {!selectedTagToAssign?.includes(item?.topic) &&
                    !fetchedUser?.topics?.includes(item?.topic) &&
                    item?.topic}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTopic;
