import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import io from "socket.io-client";

const FallbackGaugeChart = ({
  id,
  nrOfLevels,
  arcsLength,
  colors,
  percent,
  arcPadding,
  textColor,
  needleColor,
  animate,
  style,
}) => {
  try {
    return (
      <GaugeChart
        id={id}
        nrOfLevels={nrOfLevels}
        arcsLength={arcsLength}
        colors={colors}
        percent={percent}
        arcPadding={arcPadding}
        textColor={textColor}
        needleColor={needleColor}
        animate={animate}
        style={style}
      />
    );
  } catch (error) {
    console.error("Error rendering GaugeChart:", error);
    return <div style={{ color: "red" }}>Error loading chart</div>;
  }
};

const Type3 = ({
  maxValue = 100,
  minValue,
  value = 10,
  unit = "",
  topic,
  adminWidth,
  adminHeight,
}) => {
  const normalizeValue = (val, max) => Math.max(0, Math.min(val, max));
  const [livaData, setLiveData] = useState(0);
  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.emit("subscribeToTopic", topic);
    socket.on("liveMessage", (data) => {
      const value = data?.message?.message?.message ?? 0;
      const boundedValue = Math.min(Math.max(value, minValue), maxValue);
      setLiveData(boundedValue);
    });
    return () => {
      socket.disconnect();
    };
  }, [topic, maxValue, minValue]);

  return (
    <div
      style={{
        backgroundColor: "transparent",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          width: "300px",
          height: "200px",
        }}
      >
        <FallbackGaugeChart
          id="custom-gauge-chart"
          nrOfLevels={4}
          arcsLength={[0.2, 0.2, 0.4]}
          colors={["green", "#F5CD19", "red"]}
          percent={normalizeValue(livaData, maxValue) / maxValue}
          arcPadding={0.02}
          textColor="transparent"
          needleColor="#FFFFFF"
          animate={false}
          style={{
            width: "300px",
            height: "200px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 110%)",
            color: "#fff",
            background: "transparent",
            fontSize: "32px",
            fontWeight: "bold",
            lineHeight: "1",
          }}
        >
          {livaData} {unit}
        </div>
      </div>
    </div>
  );
};

export default Type3;
