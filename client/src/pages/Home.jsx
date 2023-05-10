import React from "react";
import Categories from "../components/Categories";
import NewProduct from "../components/NewProduct";
import Store from "../redux";
import { setBreadCrumb } from "../redux/reducers/globalReducer";

const Home = () => {
  const handleSetBreadCrumb = () => {
    Store.dispatch(setBreadCrumb("Home"));
  };

  return (
    <div className="container w-4/5 pb-10" style={{ margin: "0 auto" }}>
      <h1 className="title text-center my-5 text-3xl uppercase font-bold">
        Categories
      </h1>
      <Categories />
      <h1 className="title mt-8 text-3xl uppercase font-bold">New Products</h1>
      <hr className="mb-5" />
      <NewProduct handleSetBreadCrumb={handleSetBreadCrumb} />
    </div>
  );
};

export default Home;
