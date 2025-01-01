import React, { useEffect, useState } from "react";
import Gauge from "react-canvas-gauge";
import io from "socket.io-client";
import "../../../style.css";

const DigitalViewOne = ({ topic, minValue = 0, maxValue = 100, ticks = 5 }) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const calculateMajorTicks = (min, max, numTicks) => {
    const range = max - min;
    const step = range / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, index) => {
      const value = min + index * step;
      return Math.round(value).toString();
    });
  };

  // Calculate ticks based on props
  const majorTicks = React.useMemo(
    () => calculateMajorTicks(minValue, maxValue, ticks),
    [minValue, maxValue, ticks]
  );

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });

    socket.emit("subscribeToTopic", topic);

    socket.on("liveMessage", (data) => {
      const value = data?.message?.message?.message ?? 0;
      const boundedValue = Math.min(Math.max(value, minValue), maxValue);
      setCurrentSpeed(boundedValue);
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
  }, [topic, minValue, maxValue]);

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

export default DigitalViewOne;
