import React, { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TbArrowsExchange } from "react-icons/tb";
import { AiOutlineSwap } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  editSingleEmployeeSupervisor,
  editSingleSupervisorManager,
  handleRemoveManagerFromSupervisor,
  handleRemoveSupervisorFromEmployee,
  setDeleteUserPopup,
  setEditSingleManagerModel,
  setEditSingleSupervisorModel,
} from "../../../../redux/slices/ManagerEmployeeSupervisorListSlice";

const ShowNumberOfWorkers = ({
  showPopup,
  setShowPopup,
  userList,
  manager,
  MdClose,
  searchToggle,
  setSearchToggle,
  role,
  includeManager = false,
  handleDeleteUser,
  includeSupervisor = false,
  changeAllSupervisorModel,
  setChangeAllSupervisorModel,
  supervisorList,
  oldSupervisorId,
  setOldSupervisorId,
  newSupervisorId,
  setNewSupervisorId,
  editSingleSUpervisorModel,
  handleSwapSupervisors,
  editSingleManagerModel,
}) => {
  const { company } = useSelector((state) => state.MESSlice);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchBy, setSearchBy] = useState();
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [
    selectedEmpNameForEditSupervisor,
    setSelectedEmpNameForEditSupervisor,
  ] = useState("");
  const [selectedSuperNameForEditManager, setSelectedSuperNameForEditManager] =
    useState("");
  const [selectedEmpIdForEditSupervisor, setSelectedEmpIdForEditSupervisor] =
    useState("");
  const [selectedSuperIdForEditManager, setSelectedSuperIdForEditManager] =
    useState("");
  const [
    selectedSupervisorIdForEditSupervisorForEmp,
    setSelectedSupervisorIdForEditSupervisorForEmp,
  ] = useState("");
  const [
    selectedManagerIdToEditSupervisor,
    setSelectedManagerIdToEditSupervisor,
  ] = useState("");
  const [removeSupervisorIdFromEmp, setRemoveSupervisorIdFromEmp] =
    useState("");
  const [removeManagerIdFromSuper, setRemoveManagerIdFromSuper] = useState("");
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(userList);
    }
  }, [searchQuery, filteredData, userList]);

  useEffect(() => {
    setFilteredData(userList);
    setSearchQuery("");
    setSearchBy("");
  }, [showPopup, userList]);

  const handleSearch = (e) => {
    if (searchBy === "") {
      ref.current.focus();
    } else {
      const query = e.target.value;
      setSearchQuery(query);
      if (query.length > 0 && searchBy) {
        const filtered = userList.filter((user) => {
          if (searchBy === "name") {
            return user.name.toLowerCase().includes(query.toLowerCase());
          } else if (searchBy === "email") {
            return user.email.toLowerCase().includes(query.toLowerCase());
          } else if (searchBy === "supervisor" && user.supervisor) {
            return user.supervisor.name
              .toLowerCase()
              .includes(query.toLowerCase());
          } else if (searchBy === "manager" && user.manager) {
            return user.manager.name
              .toLowerCase()
              .includes(query.toLowerCase());
          }
          return false;
        });
        setFilteredData(filtered);
      } else {
        setFilteredData(userList);
      }
    }
  };

  const handleSearchByOption = (e) => {
    setSearchBy(e.target.value);
    setSearchQuery("");
  };

  const handleSignleEmpSupervisorChange = () => {
    dispatch(
      editSingleEmployeeSupervisor({
        empId: selectedEmpIdForEditSupervisor,
        superId: selectedSupervisorIdForEditSupervisorForEmp,
        companyId: company?._id,
      })
    );
  };

  const handleSignleSuperManagerChange = () => {
    dispatch(
      editSingleSupervisorManager({
        superId: selectedSuperIdForEditManager,
        managerId: selectedManagerIdToEditSupervisor,
        companyId: company?._id,
      })
    );
  };

  if (!showPopup) return null;

  return (
    <div
      data-aos="fade-up"
      data-aos-duration="300"
      data-aos-once="true"
      className="admin_show_all_managers_popup_container"
    >
      <div className="admin_show_all_managers_second_popup_container">
        <div
          className={`admin_show_all_managers_second_popup_container_search_icon_container ${
            searchToggle &&
            "admin_show_all_managers_second_popup_container_search_icon_container_reverse"
          }`}
        >
          <div onClick={() => setSearchToggle(true)}>
            <IoSearch className="admin_show_all_managers_second_popup_container_search_icon" />
          </div>
        </div>
        {role === "Employee" && (
          <div
            onClick={() => setChangeAllSupervisorModel(true)}
            className="admin_users_employee_open_swap_manager_model_container"
          >
            <AiOutlineSwap className="admin_users_employee_open_swap_manager_model_container_swap_icon" />
          </div>
        )}
        {searchToggle && (
          <div
            data-aos="fade-out"
            data-aos-duration="1000"
            data-aos-once="true"
            className="admin_show_all_managers_second_popup_container_search_container"
          >
            <input
              type="search"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search..."
            />
            <select
              name=""
              id=""
              value={searchBy}
              onChange={handleSearchByOption}
              ref={ref}
            >
              <option value="">Search by...</option>
              <option value="name">Username</option>
              <option value="email">Email</option>
              {role === "Supervisor" && (
                <option value="manager">Manager</option>
              )}
              {role === "Employee" && (
                <option value="supervisor">Supervisor</option>
              )}
            </select>
            <MdClose
              onClick={() => setSearchToggle(false)}
              color="red"
              className="ml-2 mb-1"
              size={20}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        <div
          className="admin_show_all_managers_second_popup_close_container"
          onClick={() => setShowPopup(false)}
        >
          <IoCloseSharp className="admin_show_all_managers_second_popup_close_icon" />
        </div>
        <table className="admin_show_all_managers_second_popup_table">
          <thead>
            <tr>
              <th>No.</th>
              <th
                className={
                  searchBy === "name" &&
                  `admin_show_all_managers_second_popup_table_active_th`
                }
              >
                Username
              </th>
              <th
                className={
                  searchBy === "email" &&
                  `admin_show_all_managers_second_popup_table_active_th`
                }
              >
                Email
              </th>
              <th>Phone Number</th>
              <th>Role</th>
              {includeManager && (
                <th
                  className={
                    searchBy === "manager" &&
                    `admin_show_all_managers_second_popup_table_active_th`
                  }
                >
                  Manager
                </th>
              )}
              {includeSupervisor && (
                <th
                  className={
                    searchBy === "supervisor" &&
                    `admin_show_all_managers_second_popup_table_active_th`
                  }
                >
                  Supervisor
                </th>
              )}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td
                  className={
                    searchBy === "name" &&
                    `admin_show_all_managers_second_popup_table_active_td`
                  }
                >
                  {item.name}
                </td>
                <td
                  className={
                    searchBy === "email" &&
                    `admin_show_all_managers_second_popup_table_active_td`
                  }
                >
                  {item.email}
                </td>
                <td>
                  {item.phonenumber && item.phonenumber !== "0"
                    ? item.phonenumber
                    : "--"}
                </td>
                <td>{role}</td>
                {includeManager && (
                  <td
                    className={`edit_emp_manager_model_icon_supervisor_and_manager_col
                    ${
                      searchBy === "manager" &&
                      "admin_show_all_managers_second_popup_table_active_td"
                    }`}
                  >
                    {item.manager?.name || "--"}
                    <span>
                      <MdOutlineModeEditOutline
                        onClick={() => [
                          dispatch(setEditSingleManagerModel(true)),
                          setSelectedSuperNameForEditManager(item?.name),
                          setSelectedSuperIdForEditManager(item._id),
                          setRemoveManagerIdFromSuper(item?.manager?._id),
                        ]}
                      />
                    </span>
                  </td>
                )}
                {includeSupervisor && (
                  <td
                    className={`edit_emp_manager_model_icon_supervisor_and_manager_col 
                    ${
                      searchBy === "supervisor"
                        ? "admin_show_all_managers_second_popup_table_active_td"
                        : ""
                    }`}
                  >
                    {item.supervisor?.name || "--"}
                    <span>
                      <MdOutlineModeEditOutline
                        onClick={() => [
                          dispatch(setEditSingleSupervisorModel(true)),
                          setSelectedEmpNameForEditSupervisor(item.name),
                          setSelectedEmpIdForEditSupervisor(item._id),
                          setRemoveSupervisorIdFromEmp(item?.supervisor?._id),
                        ]}
                      />
                    </span>
                  </td>
                )}
                <td>
                  <IoMdRemoveCircleOutline
                    onClick={() => [
                      handleDeleteUser(item),
                      dispatch(setDeleteUserPopup(true)),
                    ]}
                    color="red"
                    size={"20"}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {changeAllSupervisorModel && (
          <section className="admin_users_operator_changeall_supervisor_model_container">
            <div
              data-aos="fade-out"
              data-aos-duration="300"
              data-aos-once="true"
              className="admin_users_operator_changeall_supervisor_model_second_container"
            >
              <p>Change Supervisor</p>
              <div>
                <select
                  name="oldSupervisorId"
                  value={oldSupervisorId}
                  onChange={(e) => setOldSupervisorId(e.target.value)}
                >
                  <option value="">Select old supervisor</option>
                  {supervisorList?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item?.name}
                    </option>
                  ))}
                </select>

                <select
                  name="newSupervisorId"
                  value={newSupervisorId}
                  onChange={(e) => setNewSupervisorId(e.target.value)}
                >
                  <option value="">Select new supervisor</option>
                  {supervisorList?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>
              <footer>
                <button onClick={() => setChangeAllSupervisorModel(false)}>
                  Cancel
                </button>
                <button onClick={handleSwapSupervisors}>
                  Change <TbArrowsExchange />
                </button>
              </footer>
            </div>
          </section>
        )}
        {editSingleSUpervisorModel && (
          <div
            data-aos="fade-out"
            data-aos-duration="300"
            data-aos-once="true"
            className="admin_users_edit_single_user_supervisor_model_container"
          >
            <div className="admin_users_edit_single_user_supervisor_model_second_container">
              <div>
                <p>
                  Change Supervisor for{" "}
                  <b style={{ textTransform: "capitalize" }}>
                    {selectedEmpNameForEditSupervisor}
                  </b>
                </p>
              </div>
              <section>
                <select
                  onChange={(e) =>
                    setSelectedSupervisorIdForEditSupervisorForEmp(
                      e.target.value
                    )
                  }
                >
                  <option value="">Select...</option>
                  {supervisorList?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      className={
                        removeSupervisorIdFromEmp === item._id &&
                        `admin_users_edit_single_user_supervisor_model_second_container_select_option_active_supervisor`
                      }
                    >
                      {item?.name}
                    </option>
                  ))}
                </select>
              </section>
              <footer>
                <button
                  onClick={() => dispatch(setEditSingleSupervisorModel(false))}
                >
                  Cancel
                </button>

                {removeSupervisorIdFromEmp && (
                  <button
                    onClick={() =>
                      dispatch(
                        handleRemoveSupervisorFromEmployee({
                          empId: selectedEmpIdForEditSupervisor,
                          companyId: company._id,
                        })
                      )
                    }
                    style={{ background: "blue", border: "none" }}
                  >
                    Remove
                  </button>
                )}
                <button onClick={handleSignleEmpSupervisorChange}>
                  Assign <TbArrowsExchange />
                </button>
              </footer>
            </div>
          </div>
        )}
        {editSingleManagerModel && (
          <div
            data-aos="fade-out"
            data-aos-duration="300"
            data-aos-once="true"
            className="admin_users_edit_single_user_supervisor_model_container"
          >
            <div className="admin_users_edit_single_user_supervisor_model_second_container">
              <div>
                <p>
                  Change Manager for{" "}
                  <b style={{ textTransform: "capitalize" }}>
                    {selectedSuperNameForEditManager}
                  </b>
                </p>
              </div>
              <section>
                <select
                  onChange={(e) =>
                    setSelectedManagerIdToEditSupervisor(e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  {manager?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      className={
                        removeManagerIdFromSuper === item._id &&
                        `admin_users_edit_single_user_supervisor_model_second_container_select_option_active_supervisor`
                      }
                    >
                      {item?.name}
                    </option>
                  ))}
                </select>
              </section>
              <footer>
                <button
                  onClick={() => dispatch(setEditSingleManagerModel(false))}
                >
                  Cancel
                </button>
                {removeManagerIdFromSuper && (
                  <button
                    onClick={() =>
                      dispatch(
                        handleRemoveManagerFromSupervisor({
                          superId: selectedSuperIdForEditManager,
                          companyId: company._id,
                        })
                      )
                    }
                    style={{ background: "blue", border: "none" }}
                  >
                    Remove
                  </button>
                )}
                <button onClick={handleSignleSuperManagerChange}>
                  Assign <TbArrowsExchange />
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowNumberOfWorkers;
