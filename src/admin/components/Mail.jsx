import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import { MdEmail, MdReply } from "react-icons/md";
import DashboardCTitle from "../common/DashboardCTitle";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaUserLarge, FaClockRotateLeft } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/UniversalLoader";
import { FiSearch } from "react-icons/fi";
import { MdMessage } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { HiRefresh } from "react-icons/hi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import RecyclebinCard from "../common/RecyclebinCard";
import apiClient from "../../api/apiClient";
import { IoSettingsSharp } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {
  addMailCredSetActive,
  addNewCredAndSetActive,
  addNewMailCred,
  fetchMailCred,
  handleToggleAdminCred,
} from "../../redux/slices/MailiboxSlice";
import ActualMailCred from "../common/ActualMailCred";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

const Mail = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [replyBoxMessageId, setReplyBoxMessageId] = useState(null);
  const { loading } = useSelector((state) => state.UniversalLoader);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [recycleBin, setRecycleBin] = useState(false);
  const [recycleBinData, setRecycleBinData] = useState([]);
  const [replyDescription, setReplyDescription] = useState("");
  const [emailCredHistoryPopUp, setEmailCredHistoryPopUp] = useState(false);
  const [emailCredHistoryData, setEmailCredHistoryData] = useState([]);
  const [newCredData, setNewCredData] = useState({
    email: "",
    appPassword: "",
  });

  const messageEndRef = useRef(null);
  const dispatch = useDispatch();
  const { mailCred, toggleAdminCred, mailLoading } = useSelector(
    (state) => state.mailSlice
  );
  const { user } = useSelector((state) => state.userSlice);
  const read = false;

  useEffect(() => {
    dispatch(fetchMailCred());
  }, [refresh, toggleAdminCred]);

  useEffect(() => {
    const fetchMessages = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(
          "https://sarayu-node-backend.onrender.com/api/v1/supportmail"
        );
        const data = await response.json();
        setMessages(data);
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        toast.error("Something went wrong!");
      }
    };
    fetchMessages();

    // Initialize socket connection if the user is admin
    if (user.role === "admin") {
      const socket = io("https://sarayu-node-backend.onrender.com");

      socket.on("newMessage", (message) => {
        setMessages((prevMessages) => [message, ...prevMessages]);
      });

      // Cleanup socket connection on unmount
      return () => {
        socket.off("newMessage");
        socket.disconnect();
      };
    }
  }, [refresh, recycleBinData, user.role]); // Added user.role as a dependency

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = 0;
    }
  }, [messages]);

  useEffect(() => {
    fetchRecycleBinData();
  }, [recycleBin]);

  const fetchRecycleBinData = async () => {
    dispatch(setLoading(true));
    try {
      const res = await apiClient.get("/supportmail/getSoftDeletedMessage");
      setRecycleBinData(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchCredApiAll();
  }, [emailCredHistoryPopUp, refresh, mailCred]);

  const fetchCredApiAll = async () => {
    dispatch(setLoading(true));
    try {
      const res = await apiClient.get("/supportmail/allMailCred");
      setEmailCredHistoryData(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Email and password already exists!");
    }
  };

  const handleMailCredDelete = async (id) => {
    dispatch(setLoading(true));
    try {
      await apiClient.delete(`/supportmail/deleteMailCred/${id}`);
      setEmailCredHistoryData((prev) => prev.filter((item) => item._id !== id));
      dispatch(setLoading(false));
      toast.success("Deleted successfully!");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error);
    }
  };

  const handleRestoreMessage = async (id) => {
    dispatch(setLoading(true));
    try {
      await apiClient.post(`/supportmail/softDelete/restore/${id}`);
      toast.success("Message restored successfully!");
      setRecycleBinData((prev) => prev.filter((item) => item._id !== id));
      dispatch(setLoading(false));
    } catch (error) {
      toast.error("Something went wrong!");
      dispatch(setLoading(false));
    }
  };

  const handleToggleMessage = (id) => {
    setExpandedMessageId((prevId) => (prevId === id ? null : id));
  };

  const handleToggleReplyBox = (id) => {
    const message = messages.find((msg) => msg._id === id);
    if (message) {
      setReplyToEmail(message.email);
      setReplySubject(`Reply: ${message.subject}`);
      setReplyDescription(
        `\n\n--- Original Message ---\n\n${message.description}`
      );
    }
    setReplyBoxMessageId((prevId) => (prevId === id ? null : id));
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    const filtered = searchQuery
      ? messages.filter((message) =>
          message.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : messages;
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const handleDeleteMessage = async (id) => {
    dispatch(setLoading(true));
    try {
      await apiClient.delete(`/supportmail/${deleteId}`);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== deleteId)
      );
      dispatch(setLoading(false));
      toast.success("Removed successfully!");
      setDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
      setDeletePopup(false);
    }
  };

  const handleRecycleDelete = async (id) => {
    dispatch(setLoading(true));
    try {
      await apiClient.delete(`/supportmail/${id}`);
      setRecycleBinData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed successfully!");
      dispatch(setLoading(false));
    } catch (error) {
      toast.error("Something went wrong!");
      dispatch(setLoading(false));
    }
  };

  const handleSoftDeleteMessage = async () => {
    dispatch(setLoading(true));
    try {
      await apiClient.post(`/supportmail/softDelete/${deleteId}`);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== deleteId)
      );
      dispatch(setLoading(false));
      toast.success("Removed successfully!");
      setDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
      setDeletePopup(false);
    }
  };
  const handleChangeInReply = (e) => {
    setReply(e.target.value);
  };
  const handleReplySubmit = async () => {
    dispatch(setLoading(true));
    try {
      await apiClient.post("/supportmail/sendreply", {
        adminMail: mailCred?.email,
        appPassword: mailCred?.appPassword,
        email: replyToEmail,
        subject: replySubject,
        text: reply,
      });
      dispatch(setLoading(false));
      toast.success("Message sent successfully!");
      setReply("");
      setReplyBoxMessageId(null);
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Email and app password not accepted.");
    }
  };

  const handleDeletePopUp = () => {
    setDeletePopup(true);
  };
  const handleNewCredChange = (e) => {
    setNewCredData({ ...newCredData, [e.target.name]: e.target.value });
  };

  const handleSaveCreateNewCred = () => {
    if (
      newCredData.email.length > 1 &&
      newCredData.email.endsWith("@gmail.com") &&
      newCredData.appPassword.length > 1
    ) {
      dispatch(addNewMailCred(newCredData));
      setNewCredData({
        email: "",
        appPassword: "",
      });
    } else {
      toast.warning("Both fields are required and check email format!");
    }
  };

  const handleSaveCreateNewCredAndSetActive = () => {
    if (
      newCredData.email.length > 1 &&
      newCredData.email.endsWith("@gmail.com") &&
      newCredData.appPassword.length > 1
    ) {
      dispatch(addNewCredAndSetActive(newCredData));
      setNewCredData({
        appPassword: "",
      });
    } else {
      toast.warning("Both fields are required and check email format!");
    }
  };
  const handleMailCredActivate = async (id) => {
    await dispatch(addMailCredSetActive(id));
    fetchCredApiAll();
  };

  return (
    <div
      className="dashboard_main_section_container"
      data-aos="zoom-in"
      data-aos-duration="300"
      data-aos-once="true"
    >
      <DashboardCTitle
        title={"Inbox"}
        icon={<MdEmail />}
        mailCred={mailCred}
        from={"dashBoardMail"}
      />
      <div
        className={`admin_mail_cred_slider_container ${
          !toggleAdminCred && "admin_mail_cred_slider_container_hide"
        }`}
      >
        <div
          className={`admin_mail_cred_slider_left`}
          onClick={() => dispatch(handleToggleAdminCred(false))}
        ></div>
        <div
          className={`admin_mail_cred_slider_right ${
            !toggleAdminCred && "admin_mail_cred_slider_right_hide"
          }`}
        >
          <div className="admin_mail_cred_slider_right_close_container">
            <MdKeyboardDoubleArrowRight
              size={"30"}
              onClick={() => dispatch(handleToggleAdminCred(false))}
              className="admin_mail_cred_slider_right_close"
            />
          </div>
          <div className="admin_mail_cred_slider_right_main_conatiner">
            {mailLoading && (
              <div className="admin_mail_cred_slider_right_loading">
                <div class="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            {!mailLoading && (
              <>
                <p className="admin_mail_cred_slider_right_main_note">
                  Note: Here you can view your current email and passcode,
                  through which mail will be sent. You can also create a new
                  email and passcode, or a new passcode for existing emails.
                </p>
                {/* Active credetial section slider starts */}
                <div className="actual_mail_cred_conatiner">
                  <ActualMailCred
                    name={"Email"}
                    value={mailCred?.email}
                    icon={<MdOutlineMarkEmailUnread color="gray" />}
                  />
                  <ActualMailCred
                    name={"appPassword"}
                    value={mailCred?.appPassword}
                    icon={<RiLockPasswordLine color="gray" />}
                  />
                </div>
                {/* Active credetial section slider ends */}

                <div className="admin_mail_cred_slider_right_main_fields_conatiner">
                  <section className="admin_mail_cred_slider_right_main_fields_conatiner_section">
                    <h4 className="my-2 mt-4">Add new credentials</h4>
                    <div className="admin_mail_cred_slider_right_form_fields">
                      <label htmlFor="email">Admin email</label>
                      <input
                        type="email"
                        name="email"
                        value={newCredData.email}
                        onChange={handleNewCredChange}
                        id="email"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="admin_mail_cred_slider_right_form_fields">
                      <label htmlFor="appPassword">App password</label>
                      <input
                        type="text"
                        name="appPassword"
                        value={newCredData.appPassword}
                        onChange={handleNewCredChange}
                        id="appPassword"
                        placeholder="Enter your app password"
                      />
                    </div>
                    <button
                      className="btn btn-success mt-3"
                      onClick={handleSaveCreateNewCred}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-dark"
                      onClick={handleSaveCreateNewCredAndSetActive}
                    >
                      Add and Use
                    </button>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {deletePopup && (
        <div className="delete_popup">
          <div className="delete_popup_container">
            <div className="delete_popup_delete_icon_container">
              <MdDelete className="delete_popup_delete_icon" />
            </div>
            <div className="delete_popup_delete_message_container">
              <h3 className="text-center">Delete File ?</h3>
            </div>
            <div className="delete_popup_delete_btns_container">
              <button
                className="delete_popup_delete_btns_temp_del"
                onClick={handleSoftDeleteMessage}
              >
                Temporary delete
              </button>
              <button
                className="delete_popup_delete_btns_perm_del"
                onClick={handleDeleteMessage}
              >
                Permanent delete
              </button>
              <button
                onClick={() => setDeletePopup(false)}
                className="delete_popup_delete_btns_cancel_del"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {emailCredHistoryPopUp && (
        <div className="emailCredHistoryPopUp_main_bg">
          <div className="emailCredHistory_title_container">
            <FaArrowLeftLong
              onClick={() => setEmailCredHistoryPopUp(false)}
              className="mail_inbox_recyclebin_to_home_icon"
            />
            <span onClick={() => setRefresh(!refresh)}>
              <HiRefresh /> Refresh
            </span>
          </div>
          <div className="emailCredHistory_body_container">
            <div className="emailCredHistory_table_container">
              <h3 className="emailCredHistory_table_history_title">
                History (Admin Email Credentials){" "}
              </h3>
              <div className="admin_inbox_all_cred_container">
                <div className="admin_inbox_all_cred_scrollable-table">
                  <table className="admin_inbox_all_cred_table">
                    <thead>
                      <tr>
                        <th>Admin Email Address</th>
                        <th>App Passwords</th>
                        <th>Status</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailCredHistoryData?.map((item) => {
                        return (
                          <tr key={item?._id}>
                            <td>{item?.email}</td>
                            <td>{item?.appPassword}</td>
                            <td className="credHistory_tr_td_buttons">
                              {item?.active ? (
                                <button className="credHistory_tr_td_buttons_active">
                                  Active
                                </button>
                              ) : (
                                <button
                                  className="credHistory_tr_td_buttons_inactive"
                                  onClick={() =>
                                    handleMailCredActivate(item._id)
                                  }
                                >
                                  Inactivate
                                </button>
                              )}
                            </td>
                            <td>
                              <IoMdRemoveCircleOutline
                                size={"22"}
                                className="delete_mailcred_icon"
                                onClick={() => handleMailCredDelete(item?._id)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {recycleBin && (
        <div className="mail_inbox_recyclebin">
          <div className="mail_inbox_recyclebin_title_container">
            <h3 className="mail_inbox_recyclebin_title">
              <RiDeleteBin5Fill /> Recycle bin
            </h3>
            <div className="mail_inbox_recyclebin_to_home">
              <FaArrowLeftLong
                onClick={() => setRecycleBin(false)}
                className="mail_inbox_recyclebin_to_home_icon"
              />
            </div>
          </div>
          {recycleBinData.length === 0 ? (
            <div className="mail_inbox_recyclebin_empty">
              {/* <p>204</p> */}
              <p></p>
              <p>Recycle bin is empty...!</p>
            </div>
          ) : (
            <div className="recybin_message_container">
              {recycleBinData?.map((item) => {
                return (
                  <RecyclebinCard
                    handleRecycleDelete={handleRecycleDelete}
                    handleRestoreMessage={handleRestoreMessage}
                    clockIcon={<FaClockRotateLeft />}
                    item={item}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      {!recycleBin && (
        <>
          <div className="mail_search_box_container">
            <div className="mail_search_box">
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by email..."
              />
              <FiSearch className="mail_search_icon" />
            </div>
            <div className="mail_search_box_refresh_container">
              <span onClick={() => setRefresh(!refresh)}>
                <HiRefresh /> Refresh
              </span>
              <div className="mail_search_recycle_bin_container">
                <span onClick={() => setRecycleBin(true)}>
                  <RiDeleteBin5Fill /> Recycle bin
                </span>
              </div>
              <div className="mail_settings_icon_container">
                <span>
                  <IoSettingsSharp
                    onClick={() => setEmailCredHistoryPopUp(true)}
                    className="mail_settings_icon"
                  />
                </span>
              </div>
            </div>
          </div>
          {/* search container end */}
          {!loading && (
            <div className="mail_container" ref={messageEndRef}>
              {filteredMessages.length > 0 &&
                filteredMessages.map((item) => (
                  <div
                    className={`individual_email ${!read && "mail_not_read"}`}
                    key={item?._id}
                  >
                    <section className="individual_email_section_one">
                      <div className="individual_email_name_email">
                        <h3 className="center_icons_individual_mail">
                          <FaUserLarge size={"16"} />{" "}
                          {item?.username.length <= 17
                            ? item?.username
                            : item?.username.slice(0, 18) + "..."}
                        </h3>
                        <p className="center_icons_individual_mail inidividual_email_email">
                          <MdEmail /> {item?.email}
                        </p>
                      </div>
                      <div className="individual_email_time_btn">
                        <small className="center_icons_individual_mail">
                          <FaClockRotateLeft />{" "}
                          {formatDistanceToNow(new Date(item.createdAt))} ago
                        </small>
                        <section className="show_share_delete_container">
                          <span onClick={() => handleToggleMessage(item?._id)}>
                            {expandedMessageId === item?._id ? (
                              <IoIosArrowUp className="individual_mail_toggle_icon" />
                            ) : (
                              <IoIosArrowDown className="individual_mail_toggle_icon" />
                            )}
                          </span>
                          <span onClick={() => handleToggleReplyBox(item?._id)}>
                            <MdReply
                              size={"22"}
                              className="individual_mail_reply_icon"
                            />
                          </span>
                          <span
                            className="individual_mail_delete_icon"
                            onClick={() => [
                              setDeleteId(item?._id),
                              handleDeletePopUp(),
                            ]}
                          >
                            <RxCross2 />
                          </span>
                        </section>
                      </div>
                    </section>
                    <section>
                      {expandedMessageId === item?._id && (
                        <div className="mailbox_sub_desc">
                          <div className="mailbox_sub_desc_title">
                            <p className="individual_mail_message_icon_container">
                              <MdMessage
                                size={"22"}
                                className="individual_mail_message_icon"
                              />{" "}
                              Message
                            </p>
                          </div>
                          <div className="mailbox_sub_desc_content">
                            <p>
                              <b>Username:</b> &nbsp;
                              <span style={{ textTransform: "capitalize" }}>
                                {item?.username}
                              </span>
                            </p>
                            <p>
                              <b>Email:</b> &nbsp;
                              <a
                                style={{ textDecoration: "underline" }}
                                href={`mailto:${
                                  item?.email
                                }?subject=${encodeURIComponent(
                                  item?.subject
                                )}&body=${encodeURIComponent(
                                  item?.description
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span>{item?.email}</span>
                              </a>
                            </p>
                            <p>
                              <b>Subject:</b> &nbsp;
                              <span className="individual_mail_subject ml-0">
                                {item?.subject}
                              </span>
                            </p>
                            <p>
                              <b>Description:</b> <br />{" "}
                              <span className="individual_mail_body">
                                {item?.description}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </section>
                    <section>
                      {replyBoxMessageId === item?._id && (
                        <div className="individual_mail_reply_section mt-2">
                          <p>
                            <MdReply size={"22"} /> Reply &lt;
                            <a
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                                fontWeight: "400",
                              }}
                              href={`mailto:${
                                item?.email
                              }?subject=${encodeURIComponent(
                                item?.subject
                              )}&body=${encodeURIComponent(item?.description)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>{item?.email}</span>
                            </a>
                            &gt;
                          </p>
                          <div className="individual_mail_replay_container px-3 pt-3 pb-2">
                            <textarea
                              className="mail_reply_text_area"
                              rows={"10"}
                              value={reply}
                              onChange={handleChangeInReply}
                              placeholder="Enter your reply here..."
                            />
                          </div>
                          <div className="send_reply_btn_container">
                            <button
                              className="send_reply_btn mb-3"
                              disabled={reply.length === 0}
                              onClick={handleReplySubmit}
                            >
                              <MdReply size={"22"} /> Send Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </section>
                  </div>
                ))}
              {filteredMessages.length === 0 && messages.length > 0 && (
                <div className="no_mails_container mt-4">
                  <p>No match found!</p>
                </div>
              )}
              {messages.length === 0 && (
                <div className="no_mails_container mt-4">
                  <p>No mails yet</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Mail;
