import React, { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

const YestardayTd = ({ topic }) => {
  const [data, setData] = useState("");
  let encodedTopic = encodeURIComponent(topic);
  useEffect(() => {
    fetchYestardayHighest();
  }, [topic]);
  const fetchYestardayHighest = async () => {
    try {
      const res = await apiClient.get(
        `/mqtt/yesterdays-highest?topic=${encodedTopic}`
      );
      setData(res?.data?.message);
    } catch (error) {
      console.log(error?.message);
    }
  };
  return <td>{data ? data : "-"}</td>;
};
export default YestardayTd;
