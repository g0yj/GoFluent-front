import { configureStore } from "@reduxjs/toolkit";
import errorStore from "./error-store";
import loginUserStore from "./login-user-store";

export default configureStore({
  reducer: {
    error: errorStore.reducer,
    loginUser: loginUserStore.reducer,
  },
});
