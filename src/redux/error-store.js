import { createSlice } from "@reduxjs/toolkit";

const errorStore = createSlice({
  name: "errorStore",
  initialState: { message: undefined },
  reducers: {
    set: (state, action) => {
      const { message } = action.payload;
      state.message = message;
    },
    clear: (state) => {
      state.message = undefined;
    },
  },
});

export const { set, clear } = errorStore.actions;
export default errorStore;
