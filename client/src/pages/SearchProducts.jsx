import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useSearchProductsQuery } from "../redux/services/homeProducts";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ProductSkeleton from "../components/ProductSkeleton";

const SearchProducts = () => {
  const { keyword, page = 1 } = useParams();
  const { data, isFetching } = useSearchProductsQuery({
    keyword,
    page: parseInt(page),
  });
  return (
    <>
      <Header name="Search"></Header>
      <div className="container w-4/5 pb-10" style={{ margin: "0 auto" }}>
        {isFetching ? (
          <ProductSkeleton />
        ) : data.count > 0 ? (
          <>
            <p className="text-base font-medium text-gray-700 mt-5 mb-7">
              Have {data.count} products found for{" "}
              <span className="text-blue-600">{keyword}</span> keyword
            </p>
            <div className="grid grid-cols-4 gap-4">
              {data.products.map((product) => {
                return <ProductCard product={product} key={product.id} />;
              })}
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path={`cat-products/${keyword}`}
              theme="light"
            />
          </>
        ) : (
          <p className="alert-danger mt-5">
            No products found for{" "}
            <span className="text-blue-600">{keyword}</span> keyword
          </p>
        )}
      </div>
    </>
  );
};

export default SearchProducts;
