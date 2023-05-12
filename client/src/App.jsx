/**
 * Import Components
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "react-toastify/dist/ReactToastify.css";

import UserAuthRoute from "./routes/UserAuthRoute";
import UserRoute from "./routes/UserRoute";
import Public from "./routes/Public";
import Private from "./routes/Private";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthForm from "./pages/AuthForm";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CatProducts from "./pages/CatProducts";
import Profile from "./pages/Profile";
import DetailProduct from "./pages/DetailProduct";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import UserOrders from "./pages/UserOrders";
import ErrorNotFound from "./pages/ErrorNotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCustomers from "./pages/admin/AdminCustomers";
import CreateProduct from "./pages/admin/CreateProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import CreateCategory from "./pages/admin/CreateCategory";
import UpdateCategory from "./pages/admin/UpdateCategory";
import AdminOrder from "./pages/admin/AdminOrder";
import CreateCustomer from "./pages/admin/CreateCustomer";
import Modal from "../../client/src/components/Modal";
import { ToastContainer } from "react-toastify";
import { useState } from "react";

function Routers() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="products/:name" element={<CatProducts />} />
          <Route path="products/:name/:page" element={<CatProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route element={<UserAuthRoute />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
          <Route element={<UserRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="orders/:page" element={<UserOrders />} />
          </Route>
          <Route path="products" element={<Products />} />
          <Route path="product/:name" element={<DetailProduct />} />
          <Route path="*" element={<ErrorNotFound />} />
          <Route path="admin">
            <Route
              path="login"
              element={
                <Public>
                  <AdminLogin />
                </Public>
              }
            />
            <Route
              path="products"
              element={
                <Private>
                  <AdminProducts />
                </Private>
              }
            />
            <Route
              path="create-product"
              element={
                <Private>
                  <CreateProduct />
                </Private>
              }
            />
            <Route
              path="edit-product/:id"
              element={
                <Private>
                  <UpdateProduct />
                </Private>
              }
            />
            <Route
              path="categories"
              element={
                <Private>
                  <AdminCategories />
                </Private>
              }
            />
            <Route
              path="create-category"
              element={
                <Private>
                  <CreateCategory />
                </Private>
              }
            />
            <Route
              path="update-category/:id"
              element={
                <Private>
                  <UpdateCategory />
                </Private>
              }
            />
            <Route
              path="categories/:page"
              element={
                <Private>
                  <AdminCategories />
                </Private>
              }
            />
            <Route
              path="customers"
              element={
                <Private>
                  <AdminCustomers />
                </Private>
              }
            />
            <Route
              path="create-customer"
              element={
                <Private>
                  <CreateCustomer />
                </Private>
              }
            />
            <Route
              path="orders"
              element={
                <Private>
                  <AdminOrder />
                </Private>
              }
            />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default Routers;
