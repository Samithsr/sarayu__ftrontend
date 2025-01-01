import React, { useEffect, useState } from "react";
import "../../style.css";
import { useNavigate, useParams } from "react-router-dom";
import SmallGraph from "../graphs/smallgraph/SmallGraph";
import { IoClose } from "react-icons/io5";
import HistoryGraph from "../graphs/historygraph/HistoryGraph";

const ViewGraph = () => {
  const { topicparams } = useParams();
  const navigate = useNavigate();
  const [activeGraphBtn, setActiveGraphBtn] = useState("live");

  return (
    <div
      className="_viewgraph_main_container"
      data-aos="fade-out"
      data-aos-duration="1000"
      data-aos-once="true"
    >
      <section className="allusers_favorites_main_btn_container pt-0">
        <div>
          <button
            onClick={() => setActiveGraphBtn("live")}
            className={
              activeGraphBtn === "live" && "allusers_favorites_main_active_btn"
            }
          >
            Live
          </button>
          <button
            onClick={() => setActiveGraphBtn("history")}
            className={
              activeGraphBtn === "history" &&
              "allusers_favorites_main_active_btn"
            }
          >
            History
          </button>
        </div>
      </section>
      {activeGraphBtn === "live" && (
        <>
          <header>
            <div>{topicparams?.split("/")[2]}</div>
            <div onClick={() => navigate(-1)}>
              <IoClose />
            </div>
          </header>
          <div>
            <SmallGraph topic={topicparams} height={"550"} viewgraph={true} />
          </div>
        </>
      )}
      {activeGraphBtn === "history" && (
        <section className="_viewgraph_history_main_container">
          <HistoryGraph topic={topicparams} height={"500"} />
        </section>
      )}
    </div>
  );
};

export default ViewGraph;
