import React, { useState, useEffect } from "react";
import "../../style.css";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import Loader from "../../loader/Loader";

const Report = () => {
  const { topicparams } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);
  const [minValue, setMinValue] = useState("");
  const [reportData, setReportData] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async () => {
    setLocalLoading(true);
    if (!fromDate || !toDate || !minValue) {
      toast.warning("All fields are required");
      setLocalLoading(false);
      return;
    }
    try {
      const response = await apiClient.post("/mqtt/report-filter", {
        topic: topicparams,
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        minValue,
      });
      setReportData(response?.data?.messages || []);
      setLocalLoading(false);
    } catch (err) {
      toast.error("Failed to fetch report data. Please try again.");
      setLocalLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (reportData.length === 0) {
      toast.warning("No data available to download. Submit the form first.");
      return;
    }
    const csvData = [
      ["Value", "Unit", "Date/Time"],
      ...reportData.map((row) => [
        row.message,
        row.unit || "N/A",
        new Date(row.timestamp).toLocaleString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const topicName = topicparams.split("/")[2];
    const currentTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", "_")
      .replace(/:/g, "-");
    const fileName = `${topicName}_${currentTime}.csv`;

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="_allusers_topic_based_report_main_container">
      <div className="_allusers_topic_based_report_title_section">
        Report TagName : {topicparams.split("/")[2]}
        <span
          className="singleuserdashboard_close_icon"
          onClick={() => navigate(-1)}
        >
          <IoClose color="red" size={"20"} />
        </span>
      </div>
      <div className="_allusers_topic_based_report_second_main_container">
        <div className="_allusers_topic_based_report_input_container">
          <div className="_allusers_topic_based_report_datepicker_input">
            <label>From Date : &nbsp;</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd"
              className="date-picker"
              maxDate={toDate}
            />
          </div>
          <div className="_allusers_topic_based_report_datepicker_input">
            <label>To Date : &nbsp;</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy-MM-dd"
              className="date-picker"
              maxDate={today}
              minDate={fromDate}
            />
          </div>
          <div className="_allusers_topic_based_report_minvalue_input">
            <label>Minimum Value : &nbsp;</label>
            <input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              placeholder="N/A"
              className="value-input"
            />
          </div>
          <div className="__allusers_topic_based_report_button-container">
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
            <button onClick={handleDownloadCSV} className="download-button">
              Download CSV
            </button>
          </div>
        </div>
        {!localLoading ? (
          <div className="alluser_alloperators_container">
            <div className="alluser_alloperators_scrollable-table">
              <table className="alluser_alloperators_table">
                <thead>
                  <tr>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.length > 0 ? (
                    reportData?.map((data, index) => (
                      <tr key={index}>
                        <td>{data.message}</td>
                        <td>{data.unit || "N/A"}</td>
                        <td>{new Date(data.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          textAlign: "center",
                          background: "#f1c404",
                        }}
                      >
                        No data available. Fill the fields and click Submit.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {" "}
            <Loader />{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
