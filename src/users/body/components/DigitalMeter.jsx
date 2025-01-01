import React, { useEffect, useState } from "react";
import DigitalViewOne from "./../graphs/digitalview/DigitalViewOne";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import "../Body.css";
import { toast } from "react-toastify";
import { setUserDetails } from "../../../redux/slices/UserDetailsSlice";
import apiClient from "../../../api/apiClient";
import Type2 from "./../../../admin/components/digitalmeters/Type2";
import Type3 from "./../../../admin/components/digitalmeters/Type3";
import Type4 from "../../../admin/components/digitalmeters/Type4";

const DigitalMeter = () => {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const [loggedInUser, setLoggedInUser] = useState({});
  const [localLoading, setLocalLoading] = useState(false);

  const [assignedTopicList, setAssignedTopicList] = useState([]);
  const [topicBasedDigitalMeter, setTopicBasedDigitalMeter] = useState([]);

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
      setAssignedTopicList(res?.data?.data?.topics);
      setTopicBasedDigitalMeter(res?.data?.data?.assignedDigitalMeters);
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

  const getMeterDetails = (topic) => {
    const meter = topicBasedDigitalMeter.find((meter) => meter.topic === topic);
    if (meter) {
      return (
        <div className="meter-details">
          {meter.meterType === "Type2" && <Type2 {...meter} />}
          {meter.meterType === "Type3" && <Type3 {...meter} />}
          {meter.meterType === "Type4" && <Type4 {...meter} />}
        </div>
      );
    } else {
      return (
        <div
          style={{
            height: "60%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p style={{ margin: "0", fontSize: "20px", color: "gray" }}>
            No meter assigned...
          </p>
        </div>
      );
    }
  };

  return (
    <div className="allusers_digitalview_main_container">
      {assignedTopicList?.map((topic, index) => (
        <div key={index} className="topic-container">
          <p>Topic: {topic}</p>
          {getMeterDetails(topic)}
        </div>
      ))}
    </div>
  );
};

export default DigitalMeter;
