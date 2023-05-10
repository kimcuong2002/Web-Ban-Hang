import React from "react";
import { useAllProductsQuery } from "../redux/services/productService";
import Skeleton from "./skeleton/Skeleton";
import Thumbnail from "./skeleton/Thumbnail";
import ProductCard from "./ProductCard";

const NewProduct = ({ handleSetBreadCrumb }) => {
  const { data, isFetching } = useAllProductsQuery();

  return isFetching ? (
    <div className="flex flex-wrap -mx-4 mb-10">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          className="w-6/12 sm:w-4/12 md:w-3/12 lg:w-[20%] xl:w-2/12 p-4"
          key={item}
        >
          <Skeleton>
            <Thumbnail height="200px" />
          </Skeleton>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {data?.products?.map((product, index) => {
        return (
          <ProductCard
            handleSetBreadCrumb={handleSetBreadCrumb}
            product={product}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default NewProduct;
