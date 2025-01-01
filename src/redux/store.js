import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/UserSlice";
import MailinboxSlice from "./slices/MailiboxSlice";
import UniversalLoader from "./slices/UniversalLoader";
import UserDetailsSlice from "./slices/UserDetailsSlice";
import MESSlice from "./slices/ManagerEmployeeSupervisorListSlice";
import digitalMeterSlice from "./slices/DigitalMeterSlice";
import EmployeeTopicDataSlice from "./slices/EmployeeTopicDataSlice";
import NavBarSlice from "./slices/NavbarSlice";

const store = configureStore({
  reducer: {
    userSlice: UserSlice,
    mailSlice: MailinboxSlice,
    UniversalLoader: UniversalLoader,
    UserDetailsSlice: UserDetailsSlice,
    MESSlice: MESSlice,
    digitalMeterSlice: digitalMeterSlice,
    EmployeeTopicDataSlice: EmployeeTopicDataSlice,
    NavBarSlice: NavBarSlice,
  },
});

export default store;
