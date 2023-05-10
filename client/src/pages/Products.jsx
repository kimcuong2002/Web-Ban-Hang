import React from "react";
import { useAllProductsQuery } from "../redux/services/productService";
import ProductSkeleton from "../components/ProductSkeleton";
import ProductCard from "../components/ProductCard";
import Store from "../redux";
import { setBreadCrumb } from "../redux/reducers/globalReducer";

const Products = () => {
  const { data, isFetching } = useAllProductsQuery();

  const handleSetBreadCrumb = () => {
    Store.dispatch(setBreadCrumb("Product"));
  };

  return isFetching ? (
    <ProductSkeleton />
  ) : (
    data?.products?.length > 0 && (
      <div className="container w-4/5 py-10" style={{ margin: "0 auto" }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {data?.products.map((product, index) => (
            <ProductCard
              handleSetBreadCrumb={handleSetBreadCrumb}
              product={product}
              key={index}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default Products;
