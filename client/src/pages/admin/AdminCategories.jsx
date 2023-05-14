import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { clearMessage, setSuccess } from "../../redux/reducers/globalReducer";
import {
  useGetQuery,
  useDeleteCategoryMutation,
} from "../../redux/services/categoryService";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const Categories = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const { data = [], isFetching } = useGetQuery(page);
  const [removeCategory, response] = useDeleteCategoryMutation();
  // console.log(data);
  const deleteCat = (id) => {
    if (window.confirm("Are you really want to delete the category?")) {
      removeCategory(id);
    }
  };
  useEffect(() => {
    if (response.isSuccess) {
      dispatch(setSuccess(response?.data?.message));
    }
  }, [response?.data?.message]);
  useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, []);
  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/admin/create-category" className="btn-dark">
          <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700">
            Create
          </button>
        </Link>
      </ScreenHeader>
      {success && <div className="alert-success">{success}</div>}
      {!isFetching ? (
        data?.categories?.length > 0 && (
          <>
            <div>
              <table className="w-full bg-gray-900 rounded-md">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      name
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
                  {data?.categories?.map((category) => (
                    <tr key={category.id} className="odd:bg-gray-800">
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {category.name}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <img
                          src={`/${
                            import.meta.env.VITE_PATH_IMAGE
                          }/categories/${category.image}`}
                          alt="image name"
                          className="w-20 h-20 rounded-md object-cover"
                        />
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <Link
                          to={`/admin/update-category/${category.id}`}
                          className="btn btn-warning"
                        >
                          edit
                        </Link>
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteCat(category.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path="admin/categories"
            />
          </>
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};
export default Categories;
