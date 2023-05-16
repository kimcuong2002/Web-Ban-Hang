import currency from 'currency-formatter';
import { discount } from '../../utils/discount';
import { useSelector, useDispatch } from 'react-redux';
import Wrapper from './Wrapper';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { clearMessage, setSuccess } from '../../redux/reducers/globalReducer';
import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from '../../redux/services/userOrdersService';
import { useEffect } from 'react';
import { setInfoUser } from '../../redux/reducers/orderReducer';
import useToastify from '../../hooks/useToatify';

const AdminOrder = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { statusOrder, infoUser } = useSelector((state) => state.orderReducer);
  const [openModal, setOpenModal] = useState(false);
  const [orderBody, setOrderBody] = useState({});
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const [status, setStatus] = useState('WAITTING');
  const { cart, total } = useSelector((state) => state.cartReducer);
  const orders = useGetOrdersQuery(page);
  const [deleteOrders, response] = useDeleteOrderMutation();
  const [updateOrder, res] = useUpdateOrderMutation();
  const toast = useToastify();
  const navigate = useNavigate();

  const deleteOrder = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        deleteOrders(id);
      }
    });
  };

  useEffect(() => {
    if (!res.isSuccess) {
      res?.error?.data?.errors.map((err) => {
        toast.handleOpenToastify('error', err.msg, 1000);
      });
    }
  }, [res?.error?.data?.errors]);

  useEffect(() => {
    if (res?.isSuccess) {
      orders.refetch();
      toast.handleOpenToastify('success', 'Update successfully', 1000);
      setOpenModal(false);
    }
  }, [res?.isSuccess]);

  return (
    <div>
      {openModal && (
        <div className="2xl:w-[1400px] overflow-x-scroll">
          <Modal
            setOpen={setOpenModal}
            className="2xl:overflow-x-auto w-[1500px]"
          >
            <div className="modal_container bg-white w-[70%] p-[20px] z-[60]">
              <div className="flex justify-between text-[30px] uppercase">
                <p>Cart</p>
                <AiOutlineCloseCircle
                  onClick={() => setOpenModal(false)}
                  className="rounded-[100%] border-cyan-500 text-cyan-500 hover:bg-red-900 border-white hover:text-black cursor-pointer"
                />
              </div>
              <p className="font-[17px] mt-[20px] font-bold ">
                Customer Informations
              </p>
              <hr className="mt-[5px] mb-[10px] h-[1.5px]" />
              <div className="w-[70%] flex mb-[20px]">
                <p
                  htmlFor=""
                  className="text-[17px] mr-[10px] w-[25%] font-[16px] outline-0"
                >
                  {' '}
                  Name:
                </p>
                <input
                  className="border-2 w-[75%] py-[5px] px-[10px] rounded-[10px]"
                  placeholder="Enter customer name"
                  value={infoUser.name}
                  onChange={(e) =>
                    dispatch(setInfoUser({ ...infoUser, name: e.target.value }))
                  }
                />
              </div>
              <div className="w-[70%] flex mb-[20px]">
                <p htmlFor="" className="text-[17px] mr-[10px] w-[25%]">
                  {' '}
                  Adress:
                </p>
                <input
                  value={infoUser.address}
                  className="border-2 w-[75%] py-[5px] px-[10px] rounded-[10px]"
                  placeholder="Enter customer adress"
                  onChange={(e) =>
                    dispatch(
                      setInfoUser({
                        ...infoUser,
                        address: e.target.value,
                      })
                    )
                  }
                />
              </div>
              <div className="w-[70%] flex mb-[20px]">
                <p htmlFor="" className="text-[17px] mr-[10px] w-[25%]">
                  {' '}
                  Phone:
                </p>
                <input
                  value={infoUser.phone}
                  className="border-2 w-[75%] py-[5px] px-[10px] rounded-[10px]"
                  placeholder="Enter customer phone number"
                  onChange={(e) =>
                    dispatch(
                      setInfoUser({ ...infoUser, phone: e.target.value })
                    )
                  }
                />
              </div>
              <div className="w-[70%] flex mb-[20px]">
                <p htmlFor="" className="text-[17px] mr-[10px] w-[25%]">
                  {' '}
                  Status:
                </p>
                <select
                  id="countries"
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-[75%] border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
                >
                  <option selected={status === 'WAITTING'} value="WAITTING">
                    WAITTING
                  </option>
                  <option selected={status === 'DELIVERED'} value="DELIVERED">
                    DELIVERED
                  </option>
                  <option selected={status === 'FINISH'} value="FINISH">
                    FINISH
                  </option>
                </select>
              </div>
              <p className="mt-[20px] font-bold">Product Informations</p>
              <hr className="my-[30px] h-[1.5px]" />
              <div>
                <ul className="w-full flex uppercase justify-between text-center font-bold mb-[20px]">
                  <li className="w-[20%]">image</li>
                  <li className="w-[30%]">name</li>
                  <li className="w-[10%]">color</li>
                  <li className="w-[10%]">size</li>
                  <li className="w-[10%]">quantities</li>
                  <li className="w-[10%]">price</li>
                  <li className="w-[10%]">total</li>
                </ul>
                <hr className="mb-[20px]" />
                <div className="overflow-y-auto h-[300px]">
                  {orderBody.cart &&
                    orderBody.cart.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="w-full flex uppercase justify-between items-center text-center"
                        >
                          <div className="w-[20%] flex justify-center">
                            <img
                              src={`/${
                                import.meta.env.VITE_PATH_IMAGE
                              }/products/${item.images[0]}`}
                              alt=""
                              className="w-[150px]"
                            />
                          </div>
                          <p className="w-[30%] text-center">{item.name}</p>
                          <div className="w-[10%] h-[20px]">
                            {' '}
                            <span
                              className="block w-[25px] h-[25px] rounded-full"
                              style={{
                                backgroundColor: item.color,
                                margin: '0 auto',
                              }}
                            ></span>
                          </div>
                          <p className="w-[10%]">{item.size}</p>
                          <p className="w-[10%]">{item.quantity}</p>
                          <p className="w-[10%]">
                            {currency.format(
                              discount(item.price, item.discount),
                              {
                                code: 'USD',
                              }
                            )}
                          </p>
                          <p className="w-[10%] ">
                            {item.quantity *
                              discount(item.price, item.discount)}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="w-[100%] flex justify-end gap-x-[20px]">
                <button
                  onClick={() => {
                    updateOrder({
                      id: orderBody.id,
                      body: {
                        fullname: infoUser.name,
                        address: infoUser.address,
                        phone: infoUser.phone,
                        status: status,
                      },
                    });
                  }}
                  className="border-2 py-[5px] px-[10px] rounded-[7px] text-cyan-500 hover:bg-cyan-500 border-white hover:text-black mr-[40px]"
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      <Wrapper>
        {success && <div className="alert-success">{success}</div>}
        {!orders?.isFetching ? (
          <>
            <div>
              <table className="w-full bg-gray-900 rounded-md">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      id order
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      name customer
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      phone customer
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      adress customer
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      status
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      edit
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 ">
                      delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data &&
                    orders.data?.orders.map((item, index) => (
                      <tr key={index} className="odd:bg-gray-800">
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.id ? item?.id : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.fullname ? item?.fullname : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.phone ? item?.phone : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.address ? item?.address : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.status}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          <a
                            className="btn btn-warning"
                            onClick={() => {
                              setOrderBody({ ...item });
                              setStatus(item.status);
                              dispatch(
                                setInfoUser({
                                  ...infoUser,
                                  name: item.fullname,
                                  address: item.address,
                                  phone: item.phone,
                                })
                              );
                              setOpenModal(true);
                            }}
                          >
                            edit
                          </a>
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 pr-0">
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteOrder(item.id)}
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
              perPage={orders.data?.perPage}
              count={orders.data?.count}
              path="admin/orders"
            />
          </>
        ) : (
          <Spinner />
        )}
      </Wrapper>
    </div>
  );
};
export default AdminOrder;
