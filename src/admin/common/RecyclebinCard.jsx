import React from "react";
import "./style.css";
import { formatDistanceToNow } from "date-fns";
import { MdRestorePage } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";

const RecyclebinCard = ({
  handleRestoreMessage,
  handleRecycleDelete,
  item,
  clockIcon,
}) => {
  return (
    <div className="recyclebin_message_card">
      <div className="recyclebin_message_container">
        <div className="recyclebin_message_left">
          <div className="recyclebin_message_status-ind"></div>
        </div>
        <div className="recyclebin_message_right">
          <div className="recyclebin_message_text-wrap">
            <p className="recyclebin_message_text-content">
              <sapn className="recyclebin_message_text-link">
                {item?.email}
              </sapn>
            </p>
            <p className="recyclebin_message_time">
              {clockIcon}
              {formatDistanceToNow(new Date(item.createdAt))} ago
            </p>
          </div>
          <div className="recyclebin_message_button-wrap">
            <button
              className="recyclebin_message_primary-cta"
              onClick={() => handleRestoreMessage(item._id)}
            >
              <MdRestorePage size={"20"} /> Restore
            </button>
            <button
              className="recyclebin_message_secondary-cta"
              onClick={() => handleRecycleDelete(item._id)}
            >
              <MdOutlineDelete size={"20"} /> Permanent delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclebinCard;
