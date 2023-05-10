import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import currency from "currency-formatter";
import AccountList from "../components/AccountList";
import Spinner from "../components/Spinner";
import {
  useGetOrdersQuery,
  useReceivedOrderMutation,
} from "../redux/services/userOrdersService";
import { discount } from "../utils/discount";
import Pagination from "../components/Pagination";

const UserOrders = () => {
  let { page } = useParams();
  page = page ? page : 1;
  const { user } = useSelector((state) => state.authReducer);
  const { data, isFetching } = useGetOrdersQuery({ page, userId: user.id });
  const [updateOrder, response] = useReceivedOrderMutation();
  const orderReceived = (id) => {
    updateOrder(id);
  };
  return (
    <>
      <div className="container w-4/5 pb-10" style={{ margin: "0 auto" }}>
        <div className="">
          <div className="flex flex-wrap -mx-6">
            <div className="w-full md:w-3/12 p-6">
              <AccountList />
            </div>
            <div className="w-full md:w-9/12 p-6">
              {!isFetching ? (
                data?.orders?.length > 0 ? (
                  <>
                    <div className="table-container">
                      <table className="w-full">
                        <thead>
                          <tr className="thead-tr">
                            <th className="th">image</th>
                            <th className="th">name</th>
                            <th className="th">total</th>
                            <th className="th">details</th>
                            <th className="th">received</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.orders.map((item) => {
                            const total = currency.format(
                              discount(
                                item.productId.price,
                                item.productId.discount,
                              ) * item.quantities,
                              {
                                code: "USD",
                              },
                            );
                            return (
                              <tr className="even:bg-gray-50" key={item._id}>
                                <td className="td">
                                  <img
                                    src={`/images/${item.productId.image1}`}
                                    alt={item.productId.title}
                                    className="w-12 h-12 object-cover rounded-full"
                                  />
                                </td>
                                <td className=" td font-medium">
                                  {item.productId.title}
                                </td>
                                <td className="td font-bold ">{total}</td>
                                <td className="td">
                                  <Link
                                    to={`/user-order-details/${item._id}`}
                                    className="btn btn-indigo"
                                  >
                                    details
                                  </Link>
                                </td>
                                <td className="td">
                                  {item.status ? (
                                    item.received ? (
                                      <span className="capitalize font-medium text-emerald-600">
                                        received
                                      </span>
                                    ) : (
                                      <button
                                        className="btn btn-indigo"
                                        onClick={() => orderReceived(item._id)}
                                      >
                                        received?
                                      </button>
                                    )
                                  ) : (
                                    <span className="capitalize font-medium text-rose-600">
                                      under process
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      page={parseInt(page)}
                      perPage={data.perPage}
                      count={data.count}
                      path={`orders`}
                      theme="light"
                    />
                  </>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-100 rounded px-4 py-2.5 capitalize text-red-700 text-sm font-medium">
                    no orders
                  </div>
                )
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOrders;
