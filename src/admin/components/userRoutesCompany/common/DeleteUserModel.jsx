import React from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import {
  handleDeleteUser,
  setDeleteUserPopup,
} from "../../../../redux/slices/ManagerEmployeeSupervisorListSlice";

const DeleteUserModel = ({ id, email, deleteUserPopup, company }) => {
  const dispatch = useDispatch();
  return (
    <>
      {deleteUserPopup && (
        <div
          data-aos="fade-out"
          data-aos-duration="300"
          data-aos-once="true"
          className="admin_user_section_delete_users_popup_container"
        >
          <div className="admin_user_section_delete_users_popup_second_container">
            <div
              className="admin_user_section_delete_users_popup_delete_icon_container"
              onClick={() => dispatch(setDeleteUserPopup(false))}
            >
              <RxCross2 />
            </div>
            <div className="admin_user_section_delete_users_popup_content_container">
              <section>
                <p className="admin_user_section_delete_users_popup_content_text">
                  Are you sure you want to delete the user? <br />
                  <span
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {email}
                  </span>
                </p>
                <div>
                  <button onClick={() => dispatch(setDeleteUserPopup(false))}>
                    Cancel
                  </button>
                  <button
                    className="admin_user_section_delete_users_popup_content_button"
                    onClick={() => [
                      dispatch(
                        handleDeleteUser({ id, companyId: company._id })
                      ),
                    ]}
                  >
                    Delete
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserModel;
