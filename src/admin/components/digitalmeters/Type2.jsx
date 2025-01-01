import React, { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import io from "socket.io-client";

const Type2 = ({
  minValue = -100,
  maxValue = 100,
  unit = "",
  tick = 10,
  tickFontSize = "18px",
  topic,
  adminWidth,
  adminHeight,
}) => {
  const [liveData, setLiveData] = useState(0);
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

  const generateTicks = (min, max, tickCount) => {
    const ticks = [];
    const step = (max - min) / tickCount;
    for (let current = min; current <= max; current += step) {
      ticks.push({ value: current });
    }
    return ticks;
  };

  const ticks = generateTicks(minValue, maxValue, tick);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "200px",
        }}
      >
        <GaugeComponent
          arc={{
            nbSubArcs: 150,
            colorArray: ["#5BE12C", "#F5CD19", "#EA4228"],
            width: 0.3,
            padding: 0.003,
          }}
          labels={{
            valueLabel: {
              style: { fontSize: 28 },
              formatTextValue: () => `${liveData.toFixed(0)} ${unit}`,
            },
            tickLabels: {
              type: "outer",
              ticks: ticks,
              defaultTickValueConfig: {
                formatTextValue: (tickValue) =>
                  `${tickValue.toFixed(0)} ${unit}`,
                style: {
                  fontSize: tickFontSize,
                },
              },
            },
          }}
          value={liveData}
          maxValue={maxValue}
          minValue={minValue}
          pointer={{
            animationDuration: 0,
            animationDelay: 0,
          }}
        />
      </div>
    </div>
  );
};

export default Type2;
