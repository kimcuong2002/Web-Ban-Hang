import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { clearMessage, setSuccess } from "../../redux/reducers/globalReducer";
import Wrapper from "./Wrapper";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../redux/services/productService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const AdminProducts = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { data = [], isFetching } = useGetProductsQuery(page);
  // console.log(data);
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const [delProduct, response] = useDeleteProductMutation();

  const deleteProduct = (id) => {
    if (window.confirm("Are you really want to delete this product?")) {
      delProduct(id);
    }
  };
  useEffect(() => {
    if (response.isSuccess) {
      dispatch(setSuccess(response?.data?.message));
    }
  }, [response?.data?.message]);
  useEffect(() => {
    if (success) {
      toast.success(success);
    }
    return () => {
      dispatch(clearMessage());
    };
  }, []);

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/admin/create-product" className="btn-dark">
          <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700">
            Create
          </button>
        </Link>
        <Toaster position="top-right" />
      </ScreenHeader>
      {success && <div className="alert-success">{success}</div>}
      {!isFetching ? (
        data?.products?.length > 0 ? (
          <div>
            <table className="w-full bg-gray-900 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left uppercase">
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    name
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    price
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    stock
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    image
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    edit
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product) => (
                  <tr className="odd:bg-gray-800" key={product.id}>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {product.name}
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      ${product.price}.00
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {product.stock}
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      <img
                        src={`/${import.meta.env.VITE_PATH_IMAGE}/products/${
                          product.images[0]
                        }`}
                        alt="image name"
                        className="w-20 h-20 rounded-md object-cover"
                      />
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      <a className="btn btn-warning">edit</a>
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      <span
                        className="btn btn-danger cursor-pointer"
                        onClick={() => deleteProduct(product.id)}
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path="admin/products"
            />
          </div>
        ) : (
          "No products!"
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};
export default AdminProducts;
