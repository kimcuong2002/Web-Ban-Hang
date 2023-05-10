import { createSlice } from "@reduxjs/toolkit";

const orderReducer = createSlice({
  name: "order",
  initialState: {
    infoUser: {
      name: "",
      phone: "",
      address: "",
    },
    statusOrder: 1,
  },
  reducers: {
    setInfoUser: (state, action) => {
      state.infoUser = { ...action.payload };
    },
    setStatusOrder: (state, action) => {
      state.statusOrder = action.payload;
    },
  },
});
export const { setInfoUser } = orderReducer.actions;
export default orderReducer.reducer;
