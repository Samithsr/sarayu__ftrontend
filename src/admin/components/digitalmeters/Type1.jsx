import React, { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import io from "socket.io-client";

const VibrateMeter = ({ topic }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:8000", { transports: ["websocket"] });
    socket.on(topic, (message) => {
      setValue(message.value);
      console.log(message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const meterConfig = {
    minValue: -50,
    maxValue: 50,
    defaultValue: 0,
    unit: "V",
  };

  const handleValueChange = (newValue) => {
    // setValue(newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div style={{ width: "500px", height: "350px" }}>
        <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0.005,
            nbSubArcs: 50,
            colorArray: ["#EA4228", "#F5CD19", "#5BE12C"],
            subArcs: [
              { limit: -50, color: "#EA4228" },
              { limit: 0, color: "#F5CD19" },
              { limit: 50, color: "#5BE12C" },
            ],
            gradient: true,
          }}
          labels={{
            valueLabel: {
              formatTextValue: (value) =>
                `${value.toFixed(0)} ${meterConfig.unit}`,
              style: {
                fontSize: 35,
                fill: "white",
              },
            },
            tickLabels: {
              type: "outer",
              ticks: [
                { value: -50 },
                { value: -40 },
                { value: -30 },
                { value: -20 },
                { value: -10 },
                { value: 0 },
                { value: 10 },
                { value: 20 },
                { value: 30 },
                { value: 40 },
                { value: 50 },
              ],
              defaultTickValueConfig: {
                style: {
                  fontSize: 12,
                  fill: "white",
                },
              },
            },
          }}
          value={value}
          minValue={meterConfig.minValue}
          maxValue={meterConfig.maxValue}
          pointer={{
            type: "arrow",
            color: "white",
            width: 15,
            elastic: true,
            animationDuration: 0,
          }}
        />
      </div>
      <div
        style={{
          transform: "translateY(-100px)",
          width: "300px",
          color: "white",
        }}
      >
        <style>{`
          input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            background: orange;
            outline: none;
            border-radius: 5px;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: white;
            cursor: pointer;
            border-radius: 50%;
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: white;
            cursor: pointer;
            border-radius: 50%;
          }
        `}</style>
        <input
          type="range"
          min={-50}
          max={50}
          value={value}
          onChange={(e) => handleValueChange(Number(e.target.value))}
        />
        <div
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "5px",
            fontSize: "18px",
          }}
        >
          Current Value: {value} {meterConfig.unit}
        </div>
      </div>
    </div>
  );
};

export default VibrateMeter;
