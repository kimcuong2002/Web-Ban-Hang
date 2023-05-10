import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/authReducer";
import globalReducer from "./reducers/globalReducer";
import cartReducer from "./reducers/cartReducer";
import orderReducer from "./reducers/orderReducer";

import categoryService from "./services/categoryService";
import authService from "./services/authService";
import productService from "./services/productService";
import homeProducts from "./services/homeProducts";
import paymentService from "./services/paymentService";
import userOrdersService from "./services/userOrdersService";

const Store = configureStore({
  reducer: {
    [authService.reducerPath]: authService.reducer,
    [categoryService.reducerPath]: categoryService.reducer,
    [productService.reducerPath]: productService.reducer,
    [homeProducts.reducerPath]: homeProducts.reducer,
    [paymentService.reducerPath]: paymentService.reducer,
    [userOrdersService.reducerPath]: userOrdersService.reducer,
    authReducer: authReducer,
    globalReducer: globalReducer,
    cartReducer,
    orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authService.middleware,
      categoryService.middleware,
      productService.middleware,
      homeProducts.middleware,
      paymentService.middleware,
      userOrdersService.middleware,
    ]),
});
export default Store;
