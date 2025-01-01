import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

const WeekTd = ({ topic }) => {
  const [data, setData] = useState("");
  let encodedTopic = encodeURIComponent(topic);
  useEffect(() => {
    fetchWeeksHighest();
  }, [topic]);

  const fetchWeeksHighest = async () => {
    try {
      const res = await apiClient.get(
        `/mqtt/last-7-days-highest?topic=${encodedTopic}`
      );
      setData(res?.data?.message);
    } catch (error) {
      console.log(error?.message);
    }
  };
  return <td>{data ? data : "-"}</td>;
};

export default WeekTd;
