import currency from 'currency-formatter';
import { discount } from '../utils/discount';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from '../redux/services/userOrdersService';
import { useEffect } from 'react';
import { setInfoUser } from '../redux/reducers/orderReducer';
import useToastify from '../hooks/useToatify';
import { useParams } from 'react-router-dom';
import AccountList from '../components/AccountList';

const UserOrders = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { infoUser } = useSelector((state) => state.orderReducer);
  const [openModal, setOpenModal] = useState(false);
  const [orderBody, setOrderBody] = useState({});
  const dispatch = useDispatch();
  const orders = useGetOrdersQuery(page);
  const [deleteOrders, resDelete] = useDeleteOrderMutation();
  const [updateOrder, resUpdate] = useUpdateOrderMutation();
  const toast = useToastify();

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
    if (resUpdate?.error) {
      toast.handleOpenToastify('error', 'Update failed!', 1000);
    }
  }, [resUpdate?.error]);

  useEffect(() => {
    if (resDelete?.error) {
      toast.handleOpenToastify('error', 'Delete failed!', 1000);
    }
  }, [resDelete?.error]);

  useEffect(() => {
    if (resUpdate?.isSuccess) {
      setOpenModal(false)
      setInfoUser({
        name: '',
        address: '',
        phone: ''
      })
      orders.refetch();
      toast.handleOpenToastify('success', 'Update successfully!', 1000);
    }
  }, [resUpdate?.isSuccess]);

  useEffect(() => {
    if (resDelete?.isSuccess) {
      orders.refetch();
      toast.handleOpenToastify('success', 'Delete successfully!', 1000);
    }
  }, [resDelete?.isSuccess]);

  return (
    <div className="flex mx-auto w-[90%] mb-10 mt-10">
      <AccountList />
      <div className="w-[80%]">
        {openModal && (
          <div className="w-full ">
            <Modal
              setOpen={setOpenModal}
              className="2xl:overflow-x-auto w-[1500px]"
            >
              <div className="modal_container bg-white w-[90%] h-[90%] p-[20px] z-[60]">
                <div className="flex justify-between text-[30px] uppercase">
                  <p>Cart</p>
                  <AiOutlineCloseCircle
                    onClick={() => setOpenModal(false)}
                    className="rounded-[100%] text-cyan-500 hover:bg-red-900 border-white hover:text-black cursor-pointer"
                  />
                </div>
                <p className="mt-[20px] font-bold ">Customer Informations</p>
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
                      dispatch(
                        setInfoUser({ ...infoUser, name: e.target.value })
                      )
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
                <p className="font-[17px] mt-[20px] font-bold">
                  Product Informations
                </p>
                <hr className="my-[10px] h-[1.5px]" />
                <div>
                  <ul className="w-full flex uppercase justify-between text-center font-bold mb-[10px]">
                    <li className="w-[20%] text-sm">image</li>
                    <li className="w-[30%] text-sm">name</li>
                    <li className="w-[10%] text-sm">color</li>
                    <li className="w-[10%] text-sm">size</li>
                    <li className="w-[10%] text-sm">quantities</li>
                    <li className="w-[10%] text-sm">price</li>
                    <li className="w-[10%] text-sm">total</li>
                  </ul>
                  <hr className="mb-[10px]" />
                  <div className="overflow-y-scroll h-[150px]">
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
                                className="w-[50px]"
                              />
                            </div>
                            <p className="w-[30%] text-center text-sm">
                              {item.name}
                            </p>
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
                            <p className="w-[10%] text-sm">{item.size}</p>
                            <p className="w-[10%] text-sm">{item.quantity}</p>
                            <p className="w-[10%] text-sm">
                              {currency.format(
                                discount(item.price, item.discount),
                                {
                                  code: 'USD',
                                }
                              )}
                            </p>
                            <p className="w-[10%] text-sm">
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
                      if (
                        !infoUser.phone ||
                        !infoUser.address ||
                        !infoUser.name
                      ) {
                        return;
                      } else {
                        updateOrder({
                          id: orderBody.id,
                          body: {
                            fullname: infoUser.name,
                            address: infoUser.address,
                            phone: infoUser.phone,
                          },
                        });
                      }
                    }}
                    className="border-2 py-[5px] px-[10px] rounded-[7px] border-cyan-500 text-cyan-500 hover:bg-cyan-500 border-white hover:text-black mr-[40px]"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        )}
        {orders.isSuccess ? (
          <>
            <div className="w-[80%] overflow-x-scroll mx-auto">
              <table className=" bg-gray-900 rounded-md mx-auto">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
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
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center px-5">
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
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 pr-5">
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
              theme={'dark'}
              path="orders"
            />
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
export default UserOrders;
