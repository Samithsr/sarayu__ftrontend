import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "../../../../api/apiClient";

const HistoryGraph = ({ topic, height }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);
  const isMounted = useRef(true);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [granularity, setGranularity] = useState("minutes");
  const [graphData, setGraphData] = useState([]);

  const granularityOptions = ["seconds", "minutes", "hours", "days"];

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
      },
      grid: {
        vertLines: { color: "#eeeeee" },
        horzLines: { color: "#eeeeee" },
      },
      priceScale: {
        borderColor: "#cccccc",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "#cccccc",
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 20,
      },
    });

    areaSeriesRef.current = chartRef.current.addAreaSeries({
      topColor: "rgba(41, 98, 255, 0.3)",
      bottomColor: "rgba(0, 0, 0, 0)",
      lineColor: "rgba(41, 98, 255, 0.3)",
      lineWidth: 2,
    });

    const handleResize = () => {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) chartRef.current.remove();
    };
  }, [height]);

  const fetchGraphData = async () => {
    try {
      const body = {
        topic,
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        granularity,
      };

      const response = await apiClient.post(
        "/mqtt/realtime-data/custom-range",
        body
      );
      if (response.data.success) {
        const data = response.data.messages
          .map((msg) => {
            const timestamp = new Date(msg.timestamp);
            if (isNaN(timestamp.getTime())) {
              console.error("Invalid timestamp:", msg.timestamp);
              return null;
            }

            return {
              time: Math.floor(timestamp.getTime() / 1000),
              value: parseFloat(msg.message),
            };
          })
          .filter(Boolean);

        // Sort the data by time in ascending order
        data.sort((a, b) => a.time - b.time);

        console.log("Sorted Graph Data:", data);

        setGraphData(data);

        // Ensure the graph data is updated on the chart
        areaSeriesRef.current.setData(data);
        chartRef.current.timeScale().fitContent();
      } else {
        console.error("Error fetching graph data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error.message);
    }
  };

  useEffect(() => {
    if (graphData.length > 0) {
      areaSeriesRef.current.setData(graphData);
      console.log("Graph Data set on chart:", graphData);
    }
  }, [graphData]);

  return (
    <div>
      <div className="_historygraph_controls">
        <div className="_historygraph_date-pickers">
          <label>
            From : &nbsp;
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              maxDate={toDate} // Restrict "From" date to not exceed "To" date
              maxTime={
                fromDate.toDateString() === toDate.toDateString()
                  ? toDate
                  : new Date(
                      fromDate.getFullYear(),
                      fromDate.getMonth(),
                      fromDate.getDate(),
                      23,
                      59,
                      59
                    )
              } // Restrict time if on the same day as "To" date
            />
          </label>
          <label>
            To : &nbsp;
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              minDate={fromDate}
              maxDate={new Date()}
              minTime={
                fromDate.toDateString() === toDate.toDateString()
                  ? fromDate
                  : new Date(
                      toDate.getFullYear(),
                      toDate.getMonth(),
                      toDate.getDate(),
                      0,
                      0,
                      0
                    )
              }
              maxTime={new Date()}
            />
          </label>
        </div>

        <div className="_historygraph_dropdown">
          <label>
            Granularity : &nbsp;
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
            >
              {granularityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="_historygraph_apply-btn" onClick={fetchGraphData}>
          Apply
        </button>
      </div>

      <div style={{ marginTop: "50px" }} ref={chartContainerRef}></div>
    </div>
  );
};

export default HistoryGraph;
