import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { setLoading } from "./UniversalLoader";

export const fetchMailCred = () => {
  return async (dispatch) => {
    dispatch(handleEmailLoading(true));
    try {
      const res = await apiClient.get("/supportmail/mailCred");
      dispatch(setMailCred(res?.data?.data[0]));
      dispatch(handleEmailLoading(false));
    } catch (error) {
      dispatch(handleEmailLoading(false));
    }
  };
};

export const addNewMailCred = (body) => {
  return async (dispatch) => {
    dispatch(handleEmailLoading(true));
    try {
      await apiClient.post(`/supportmail/mailCred`, body);
      dispatch(handleEmailLoading(false));
      toast.success("Successfully created!");
    } catch (error) {
      dispatch(handleSetError(error.message));
      dispatch(handleEmailLoading(false));
      toast.warning("Same email and app password exists!");
    }
  };
};

export const addNewCredAndSetActive = (body) => {
  return async (dispatch) => {
    dispatch(handleEmailLoading(true));
    try {
      await apiClient.post(`/supportmail/createMailCredSetActive`, body);
      dispatch(handleEmailLoading(false));
      toast.success("Successfully created and seted as active!");
      dispatch(fetchMailCred());
    } catch (error) {
      dispatch(handleSetError(error.message));
      dispatch(handleEmailLoading(false));
      toast.warning("Same email and app password exists!");
    }
  };
};

export const addMailCredSetActive = (id) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await apiClient.post(`/supportmail/setActiveMailCred/${id}`);
      dispatch(setLoading(false));
      toast.success("Activated successfull!");
      dispatch(fetchMailCred());
    } catch (error) {
      dispatch(handleSetError(error.message));
      dispatch(setLoading(false));
      toast.error("Something went wrong!");
    }
  };
};

const MailinboxSlice = createSlice({
  name: "MailinboxSlice",
  initialState: {
    mailCred: {},
    toggleAdminCred: false,
    mailLoading: true,
    error: null,
  },
  reducers: {
    handleToggleAdminCred: (state, action) => {
      state.toggleAdminCred = action.payload;
    },
    handleSetError(state, action) {
      state.error = action.payload;
    },
    handleEmailLoading(state, action) {
      state.mailLoading = action.payload;
    },
    setMailCred(state, action) {
      state.mailCred = action.payload;
    },
  },
});

export const {
  handleToggleAdminCred,
  handleEmailLoading,
  handleSetError,
  setMailCred,
} = MailinboxSlice.actions;
export default MailinboxSlice.reducer;
