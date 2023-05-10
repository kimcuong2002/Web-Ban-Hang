import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useCatProductsQuery } from "../redux/services/homeProducts";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ProductSkeleton from "../components/ProductSkeleton";
import Store from "../redux";
import { setBreadCrumb } from "../redux/reducers/globalReducer";

const CatProducts = () => {
  const { name, page = 1 } = useParams();
  const { data, isFetching } = useCatProductsQuery({
    name,
    page: parseInt(page),
  });

  const handleSetBreadCrumb = () => {
    Store.dispatch(setBreadCrumb(""));
  };

  const imageCat =
    "/" +
    import.meta.env.VITE_PATH_IMAGE +
    "/categories/" +
    data?.imageCategory;

  return (
    <div>
      <Header imageCat={imageCat} name={name}></Header>
      <div className="container w-4/5 pb-10" style={{ margin: "0 auto" }}>
        {isFetching ? (
          <ProductSkeleton />
        ) : data.count > 0 ? (
          <>
            <p className="text-base font-medium text-gray-700 mt-5 mb-7">
              Have {data.count} products found in #{name} category
            </p>
            <div className="grid grid-cols-4 gap-4">
              {data.products.map((product) => {
                return (
                  <ProductCard
                    handleSetBreadCrumb={handleSetBreadCrumb}
                    product={product}
                    key={product.id}
                  />
                );
              })}
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path={`cat-products/${name}`}
              theme="light"
            />
          </>
        ) : (
          <p className="text-base font-medium mt-5 mb-7 text-red-500">
            No products found in #{name} category
          </p>
        )}
      </div>
    </div>
  );
};

export default CatProducts;
