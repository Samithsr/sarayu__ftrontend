import React, { useEffect, useState } from "react";
import "./style.css";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const SubscritionBtn = ({ topic }) => {
  const [subscribed, setSubscribed] = useState(false);
  let encodedTopic = encodeURIComponent(topic);
  const [subscribeToggler, setSubscribeToggler] = useState(false);
  useEffect(() => {
    fetchSubscriptionApi();
  }, [topic, subscribeToggler]);

  const fetchSubscriptionApi = async () => {
    try {
      const res = await apiClient.get(
        `/mqtt/is-subscribed?topic=${encodedTopic}`
      );
      setSubscribed(res?.data?.isSubscribed);
    } catch (error) {
      console.error("Error fetching subscription status:", error.message);
    }
  };

  const handleSubscribe = async () => {
    try {
      await apiClient.post("/mqtt/subscribe", {
        topic: topic,
      });
      setSubscribeToggler(!subscribeToggler);
      toast.success(`${topic} subscribed successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await apiClient.post("/mqtt/unsubscribe", {
        topic: topic,
      });
      setSubscribeToggler(!subscribeToggler);
      toast.warning(`${topic} unsubscribed successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {subscribed ? (
        <button
          onClick={handleUnsubscribe}
          className="admin_alltopicname_table_subscribed_button"
        >
          Unsubscribe
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          className="admin_alltopicname_table_subscribe_button"
        >
          Subscribe
        </button>
      )}
    </div>
  );
};

export default SubscritionBtn;
