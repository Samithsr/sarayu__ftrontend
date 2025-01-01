import React, { useEffect, useState, useMemo } from "react";
import Gauge from "react-canvas-gauge";
import io from "socket.io-client";

const Type4 = ({
  topic,
  minValue = 0,
  maxValue = 100,
  ticks = 5,
  socketUrl = "http://localhost:5000",
}) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);

  // Memoized calculation of major ticks
  const majorTicks = useMemo(() => {
    const range = maxValue - minValue;
    const step = range / (ticks - 1);
    return Array.from({ length: ticks }, (_, index) => {
      const value = minValue + index * step;
      return Math.round(value).toString();
    });
  }, [minValue, maxValue, ticks]);

  useEffect(() => {
    // Create socket connection
    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Subscribe to topic
    const handleSubscribe = () => {
      socket.emit("subscribeToTopic", topic);
    };

    // Handle live message
    const handleLiveMessage = (data) => {
      try {
        // Safely extract value with fallback
        const rawValue = data?.message?.message?.message ?? 0;

        // Ensure value is within specified range
        const boundedValue = Math.min(
          Math.max(Number(rawValue), minValue),
          maxValue
        );

        // Update state with bounded value
        setCurrentSpeed(boundedValue);
      } catch (error) {
        console.error("Error processing live message:", error);
      }
    };

    // Error handling
    const handleError = (error) => {
      console.error("Socket connection error:", error);
    };

    // No data handling
    const handleNoData = (message) => {
      console.warn("No data received:", message);
    };

    // Event listeners
    socket.on("connect", handleSubscribe);
    socket.on("liveMessage", handleLiveMessage);
    socket.on("noData", handleNoData);
    socket.on("error", handleError);

    // Cleanup function
    return () => {
      socket.emit("unsubscribeFromTopic", topic);
      socket.off("connect", handleSubscribe);
      socket.off("liveMessage", handleLiveMessage);
      socket.off("noData", handleNoData);
      socket.off("error", handleError);
      socket.disconnect();
    };
  }, [topic, minValue, maxValue, socketUrl]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        width: "160px",
      }}
    >
      <Gauge
        value={currentSpeed}
        minValue={minValue}
        maxValue={maxValue}
        width={300}
        height={300}
        title="V"
        majorTicks={majorTicks}
        minorTicks={2}
        strokeTicks={true}
        colors={{
          plate: "#fff",
          majorTicks: "#000",
          minorTicks: "#000",
          title: "#000",
          units: "#000",
          numbers: "#000",
          needle: {
            start: "rgba(240, 128, 128, 1)",
            end: "rgba(255, 160, 122, .9)",
          },
          highlights: [
            { from: minValue, to: maxValue / 2, color: "#EA4228" },
            { from: maxValue / 2, to: maxValue, color: "#5BE12C" },
          ],
        }}
      />
    </div>
  );
};

export default Type4;
