import React from "react";
import { Link, json, useLocation, useParams } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useGetProductQuery } from "../redux/services/productService";
import DetailsCard from "../components/DetailCard";
import ProductLoader from "../components/ProductLoader";
import Store from "../redux";

const DetailProduct = () => {
  const { name } = useParams();
  const { data, isFetching } = useGetProductQuery(name);
  const breadScrumb = Store.getState().globalReducer.breadCrumb;
  const breadCrumbLocal = JSON.parse(localStorage.getItem("breadCrumbLocal"));
  return (
    <div className="container w-4/5 pb-10" style={{ margin: "0 auto" }}>
      <div className="my-container mt-5">
        {isFetching ? (
          <ProductLoader />
        ) : (
          <>
            <ul className="flex items-center">
              <li className="capitalize text-gray-600 hover:text-black">
                <Link to={breadScrumb === "Home" ? "/" : `/${breadScrumb}`}>
                  {breadScrumb === "" ? breadCrumbLocal : breadScrumb}
                </Link>
              </li>
              <FiChevronRight
                className={`mx-2 ${
                  breadCrumbLocal === "" ? "hidden" : "block"
                }`}
              />
              <li className="capitalize text-gray-600 hover:text-black">
                <Link to={`/products/${data.category?.name}`}>
                  {data.category?.name}
                </Link>
              </li>
              <FiChevronRight className="block mx-2" />
              <li className="capitalize text-gray-600 hover:text-black">
                <Link to={`/product/${data.id}`}>{data.name}</Link>
              </li>
            </ul>
            <DetailsCard product={data} />
          </>
        )}
      </div>
    </div>
  );
};

export default DetailProduct;
