import React, { useEffect, useState } from "react";
import "../../style.css";
import { useNavigate, useParams } from "react-router-dom";
import SmallGraph from "../graphs/smallgraph/SmallGraph";
import { IoClose } from "react-icons/io5";
import apiClient from "../../../api/apiClient";

const EditGraph = () => {
  const { topicparams } = useParams();
  const [thresholdNumber, setThresholdNumber] = useState(0);
  const [thresholds, setThreshold] = useState([]);
  const navigate = useNavigate();

  let topic = encodeURIComponent(topicparams);

  useEffect(() => {
    fetchThresholdApi();
  }, []);

  useEffect(() => {
    const updatedThresholds = Array.from(
      { length: Number(thresholdNumber) },
      (_, index) => {
        return thresholds[index] || { value: "", color: "orange" };
      }
    );
    setThreshold(updatedThresholds);
  }, [thresholdNumber]);

  const fetchThresholdApi = async () => {
    try {
      const res = await apiClient.get(`/mqtt/get?topic=${topic}`);
      const fetchedThresholds = res?.data?.data?.thresholds || [];
      const processedThresholds = fetchedThresholds.map((threshold) => ({
        ...threshold,
        value: parseInt(threshold.value, 10), 
      }));
      setThreshold(processedThresholds);
      setThresholdNumber(processedThresholds.length);
    } catch (error) {
      console.log("No threshold is present");
    }
  };

  const handleSelectNumberOfThreshold = (e) => {
    setThresholdNumber(e.target.value);
  };

  const handleThresholdChange = (index, key, value) => {
    const updatedThresholds = [...thresholds];
    updatedThresholds[index] = {
      ...updatedThresholds[index],
      [key]: key === "value" ? parseInt(value, 10) || 0 : value,
    };
    setThreshold(updatedThresholds);
  };

  const handleSaveChanges = async () => {
    try {
      await apiClient.post(`/mqtt/add?topic=${topic}`, {
        thresholds: thresholds,
      });
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="_editgraph_main_container">
      <div className="_editgraph_second_main_container">
        <div className="_editgraph_second_main_left_container">
          <header>
            <div>Edit {topicparams?.split("/")[2]}</div>
            <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
              <IoClose />
            </div>
          </header>
        </div>
        <div className="_editgraph_graph_container">
          <div className="_editgraph_graph_left">
            <SmallGraph topic={topicparams} height={"400"} shadow={true} />
          </div>
          <div className="_editgraph_graph__right">
            <h5 className="m-0 my-3 text-center">Set threshold</h5>
            <div className="_editgraph_main_input_container">
              <div className="_editgraph_main_select_numberof_threshold">
                <select
                  value={thresholdNumber}
                  onChange={handleSelectNumberOfThreshold}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
              {[...Array(Number(thresholdNumber))].map((_, index) => (
                <section key={index}>
                  <div>
                    <input
                      type="number"
                      value={thresholds[index]?.value || ""}
                      placeholder={`Enter threshold ${index + 1}`}
                      onChange={(e) =>
                        handleThresholdChange(index, "value", e.target.value)
                      }
                    />
                    <select
                      value={thresholds[index]?.color || ""}
                      onChange={(e) =>
                        handleThresholdChange(index, "color", e.target.value)
                      }
                    >
                      <option value="orange">Yellow</option>
                      <option value="red">Red</option>
                    </select>
                  </div>
                </section>
              ))}
              <div className="_editgraph_savechanges_button_container">
                <button onClick={() => setThreshold([])}>Clear All</button>
                <button onClick={handleSaveChanges}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGraph;
