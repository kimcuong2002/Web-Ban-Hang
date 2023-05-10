import React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { clearMessage, setSuccess } from "../../redux/reducers/globalReducer";
import {
  useGetQuery,
  useDeleteCustomerMutation,
} from "../../redux/services/authService";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const AdminCustomers = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const { data = [], isFetching } = useGetQuery(page);
  const [removeCategory, response] = useDeleteCustomerMutation();
  const deleteCustomer = (id) => {
    if (window.confirm("Are you really want to delete the customer?")) {
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
        <Link to="/admin/create-customer" className="btn-dark">
          <button className="px-5 py-3 bg-[#242424] rounded-md hover:bg-green-700">
            Create
          </button>
        </Link>
      </ScreenHeader>
      {success && <div className="alert-success">{success}</div>}
      {!isFetching ? (
        data?.users?.length > 0 && (
          <>
            <div>
              <table className="w-full bg-gray-900 rounded-md">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      username
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      avt
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      fullname
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      email
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      role
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
                  {data?.users?.map((user) => (
                    <tr key={user.id} className="odd:bg-gray-800">
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {user.username}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <img
                          src={`/${import.meta.env.VITE_PATH_IMAGE}/users/${
                            user.avatar
                          }`}
                          alt="image"
                          className="w-14 h-14 rounded-md object-cover"
                        />
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {user.fullname}
                      </td>
                      <td className="p-3 text-sm font-normal text-gray-400">
                        {user.email}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {user.admin ? "admin" : "user"}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <Link
                          to={`/admin/update-user/${user.id}`}
                          className="btn btn-warning"
                        >
                          edit
                        </Link>
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <button
                          className="btn btn-danger capitalize"
                          onClick={() => deleteCustomer(user.id)}
                        >
                          delete
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
              path="admin/users"
            />
          </>
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};

export default AdminCustomers;
