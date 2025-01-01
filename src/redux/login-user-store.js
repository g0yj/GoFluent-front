import { createSlice } from "@reduxjs/toolkit";

const loginUserStore = createSlice({
  name: "loginUserStore",
  initialState: { id: "", name: "", token: "", type: "" },
  reducers: {
    set: (state, action) => {
      const { id, name, token, type } = action.payload;
      state.id = id;
      state.name = name;
      state.token = token;
      state.type = type;
    },
    clear: (state) => {
      state.id = "";
      state.name = "";
      state.token = "";
      state.type = "";
    },
  },
});

export const { set, clear } = loginUserStore.actions;
export default loginUserStore;
