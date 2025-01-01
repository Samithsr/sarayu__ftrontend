import React, { useEffect, useState } from "react";
import "../../style.css";
import io from "socket.io-client";

const LiveDataTd = ({ topic }) => {
  const [liveMessage, setLiveMessages] = useState();
  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.emit("subscribeToTopic", topic);
    socket.on("liveMessage", (data) => {
      setLiveMessages(data?.message?.message?.message);
    });
    socket.on("noData", (data) => {
      console.warn(data.message);
    });

    socket.on("error", (data) => {
      console.error(data.message);
    });

    return () => {
      socket.emit("unsubscribeFromTopic");
      socket.disconnect();
    };
  }, [topic]);

  return <td>{liveMessage ? liveMessage : "-"}</td>;
};

export default LiveDataTd;
