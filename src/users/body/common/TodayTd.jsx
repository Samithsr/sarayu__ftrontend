import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

const TodayTd = ({ topic }) => {
  const [data, setData] = useState("");
  const encodedTopic = encodeURIComponent(topic);

  const fetchTodaysHighest = async () => {
    try {
      const res = await apiClient.get(
        `/mqtt/todays-highest?topic=${encodedTopic}`
      );
      setData(res?.data?.message || "-");
      console.log("Fetched data:", res?.data?.message);
    } catch (error) {
      console.error("Error fetching today's highest:", error?.message);
    }
  };

  useEffect(() => {
    fetchTodaysHighest();
    const interval = setInterval(() => {
      fetchTodaysHighest();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [encodedTopic]);

  return <td>{data}</td>;
};

export default TodayTd;
