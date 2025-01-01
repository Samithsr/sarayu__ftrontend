import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { setLoading } from "./UniversalLoader";

const fetchData = (url, successAction, errorAction, companyId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiClient.get(`${url}/${companyId}`);
      dispatch(successAction(res?.data?.data || res.data));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error || "Failed to fetch data");
    }
  };
};
export const fetchAllEmployees = (companyId) => {
  return fetchData(
    `/auth/employee/getAllEmployeesOfSameCompany`,
    (data) =>
      setEmployeesList(
        Object.values(data).flatMap((supervisorGroup) => supervisorGroup)
      ),
    setLoading,
    companyId
  );
};
export const fetchCompany = (companyId) => {
  return fetchData(`/auth/company`, setCompany, setLoading, companyId);
};

export const fetchManager = (companyId) => {
  return fetchData(`/auth/getAllManager`, setManager, setLoading, companyId);
};

export const fetchAllTheSupervisor = (companyId) => {
  return fetchData(
    `/auth/supervisor/getAllSupervisorOfSameCompany`,
    setSupervisorList,
    setLoading,
    companyId
  );
};

export const handleDeleteUser = ({ id, companyId }) => {
  return async (dispatch) => {
    try {
      await apiClient.delete(`/auth/deleteAnyEmployee/${id}`);
      dispatch(setDeleteEmployeesListValue(id));
      dispatch(fetchAllEmployees(companyId));
      dispatch(fetchAllTheSupervisor(companyId));
      dispatch(setDeleteUserPopup(false));
      toast.success("Successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };
};
export const editSingleEmployeeSupervisor = ({ empId, superId, companyId }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await apiClient.post(
        `/auth/employee/changeSupervisor/${empId}/${superId}`
      );
      dispatch(fetchAllEmployees(companyId));
      dispatch(setLoading(false));
      dispatch(setEditSingleSupervisorModel(false));
      toast.success("Supervisor changed successfully");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };
};

export const editSingleSupervisorManager = ({
  superId,
  managerId,
  companyId,
}) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      apiClient.post(`/auth/employee/changeManager/${superId}/${managerId}`);
      dispatch(fetchAllTheSupervisor(companyId));
      dispatch(setLoading(false));
      dispatch(setEditSingleManagerModel(false));
      toast.success("Manager changed successfully");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };
};

export const handleRemoveSupervisorFromEmployee = ({ empId, companyId }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await apiClient.post(`/auth/employee/removeSupervisor/${empId}`);
      dispatch(fetchAllEmployees(companyId));
      dispatch(setLoading(false));
      dispatch(setEditSingleSupervisorModel(false));
      toast.success("Supervisor removed from employee.");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };
};

export const handleRemoveManagerFromSupervisor = ({ superId, companyId }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await apiClient.post(`/auth/supervisor/removeManager/${superId}`);
      dispatch(fetchAllTheSupervisor(companyId));
      dispatch(setLoading(false));
      dispatch(setEditSingleManagerModel(false));
      toast.success("Manager removed from supervisor.");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };
};

const MESSlice = createSlice({
  name: "ManagerEmployyesSupervisorSlice",
  initialState: {
    company: [],
    manager: [],
    supervisorList: [],
    employeesList: [],
    deleteUserPopup: false,
    editSingleSUpervisorModel: false,
    editSingleManagerModel: false,
  },
  reducers: {
    setEmployeesList(state, action) {
      state.employeesList = action.payload;
    },
    setCompany(state, action) {
      state.company = action.payload;
    },
    setManager(state, action) {
      state.manager = action.payload;
    },
    setSupervisorList(state, action) {
      state.supervisorList = action.payload;
    },
    setDeleteEmployeesListValue(state, action) {
      const id = action.payload;
      state.employeesList = state.employeesList.filter(
        (item) => item._id !== id
      );
      state.supervisorList = state.supervisorList.filter(
        (item) => item._id !== id
      );
      state.manager = state.manager.filter((item) => item._id !== id);
    },
    setDeleteUserPopup(state, action) {
      state.deleteUserPopup = action.payload;
    },
    setEditSingleSupervisorModel(state, action) {
      state.editSingleSUpervisorModel = action.payload;
    },
    setEditSingleManagerModel(state, action) {
      state.editSingleManagerModel = action.payload;
    },
  },
});

export const {
  setEmployeesList,
  setDeleteEmployeesListValue,
  setDeleteUserPopup,
  setManager,
  setCompany,
  setSupervisorList,
  setEditSingleSupervisorModel,
  setEditSingleManagerModel,
} = MESSlice.actions;
export default MESSlice.reducer;
