import { createSlice } from "@reduxjs/toolkit";
import { discount } from "../../utils/discount";
const cartData = localStorage.getItem("cart");
const cartArray = cartData ? JSON.parse(cartData) : [];

function allItems(data) {
  let items = 0;
  for (let i = 0; i < data.length; i++) {
    items += data[i].quantity;
  }
  return items;
}
function calcuateTotal(data) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += discount(data[i].price, data[i].discount) * data[i].quantity;
  }
  return total;
}
const cartReducer = createSlice({
  name: "cart",
  initialState: {
    cart: cartArray.length > 0 ? cartArray : [],
    items: cartArray.length > 0 ? allItems(cartArray) : 0,
    total: cartArray.length > 0 ? calcuateTotal(cartArray) : 0,
  },
  reducers: {
    addCart: (state, { payload }) => {
      state.cart.push(payload);
      state.items += payload.quantity;
      state.total +=
        discount(payload.price, payload.discount) * payload.quantity;
    },
    incQuantity: (state, { payload }) => {
      const product = state.cart[payload];
      product.quantity += 1;
      state.items += 1;
      state.total += discount(product.price, product.discount);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    decQuantity: (state, { payload }) => {
      const product = state.cart[payload];
      const quan = (product.quantity -= 1);
      if (quan === 0) {
        state.cart.splice(payload, 1);
      }
      state.items -= 1;
      state.total -= discount(product.price, product.discount);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeItem: (state, { payload }) => {
      const find = state.cart.find((item) => item.id === payload);
      if (find) {
        const index = state.cart.indexOf(find);
        state.items -= find.quantity;
        state.total -= discount(find.price, find.discount) * find.quantity;
        state.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    emptyCart: (state) => {
      state.cart = [];
      state.items = 0;
      state.total = 0;
    },
    setCart: (state, { payload }) => {
      localStorage.setItem("cart", JSON.stringify(payload));
      state.cart = payload;
    },
    setTotal: (state, { payload }) => {
      state.total = payload;
    },
  },
});
export const {
  addCart,
  incQuantity,
  decQuantity,
  removeItem,
  emptyCart,
  setCart,
  setTotal,
} = cartReducer.actions;
export default cartReducer.reducer;
