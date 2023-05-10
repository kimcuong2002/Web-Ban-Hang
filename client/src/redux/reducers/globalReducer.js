import { createSlice } from "@reduxjs/toolkit";

const globalReducer = createSlice({
  name: "global",
  initialState: {
    success: "",
    searchBar: false,
    breadCrumb: "",
  },
  reducers: {
    setSuccess: (state, action) => {
      console.log(action);
      state.success = action.payload;
    },
    clearMessage: (state) => {
      state.success = "";
    },
    toggleSearchBar: (state) => {
      state.searchBar = !state.searchBar;
    },
    setBreadCrumb: (state, action) => {
      state.breadCrumb = action.payload;
      localStorage.setItem("breadCrumbLocal", JSON.stringify(state.breadCrumb));
    },
  },
});
export const { setSuccess, clearMessage, toggleSearchBar, setBreadCrumb } =
  globalReducer.actions;
export default globalReducer.reducer;
