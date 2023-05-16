import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import currency from 'currency-formatter';
import { BsTrash } from 'react-icons/bs';
import { ImCross } from 'react-icons/im';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { discount } from '../utils/discount';
import useToastify from '../hooks/useToatify';
import Quantity from '../components/Quantity';
import { setCart, setTotal } from '../redux/reducers/cartReducer';
import {
  incQuantity,
  decQuantity,
  removeItem,
} from '../redux/reducers/cartReducer';
import { useCreateOrderMutation } from '../redux/services/userOrdersService';
import Modal from '../components/Modal';
import { setInfoUser } from '../redux/reducers/orderReducer';
import {
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetCartByIdUserQuery,
  useCreateCartMutation
} from '../redux/services/cartService';

const Cart = () => {
  const [openModal, setOpenModal] = useState(false);
  const { cart, total } = useSelector((state) => state.cartReducer);
  const { infoUser } = useSelector((state) => state.orderReducer);
  const { user, userToken } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const toast = useToastify();
  const [createCart, response] = useCreateCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart, resDelete] = useDeleteCartMutation();
  const [createOrder, resp] = useCreateOrderMutation();
  const { data, refetch } = useGetCartByIdUserQuery(user?.id);
  const inc = (i) => {
    dispatch(incQuantity(i));
  };

  const dec = (i) => {
    dispatch(decQuantity(i));
  };

  const remove = (id) => {
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
        dispatch(removeItem(id));
      }
    });
  };

  useEffect(() => {
    let arr = data?.cart[0]?.cart ? data?.cart[0]?.cart : [];
    let total = 0;
    if(userToken && data?.cart.length > 0) {
      for (let a of arr) {
        total += discount(a.price * a.quantity, a.discount);
      }
      dispatch(setCart(arr));
      dispatch(setTotal(total));
    }
  }, []);

  useEffect(() => {
    if(response?.isSuccess) {
      localStorage.setItem('cartId', response.data?.cart.id);
    }
  }, [response?.isSuccess])

  useEffect(() => {
    const id = localStorage.getItem('cartId');
    if (id) {
      if (cart.length !== 0) {
        updateCart({
          id: id,
          body: {
            cart: cart,
          },
        });
      } else {
        deleteCart(id);
        localStorage.removeItem('cartId');
      }
    } else {
      if(cart.length !== 0) {
        createCart({
          userId: user?.id,
          cart: cart,
        })
      }
    }
  }, [cart]);

  useEffect( () => {
    if (resp?.isSuccess) {
      const id = localStorage.getItem('cartId');
      if (id) {
        deleteCart(id)
      }
      toast.handleOpenToastify('success', 'Purchase successfully!', 1000);
      localStorage.removeItem('cartId');
      dispatch(setCart([]));
      localStorage.removeItem('cart');
      dispatch(setInfoUser({ name: '', address: '', phone: '' }));
      setOpenModal(false);
    }
  }, [resp?.isSuccess]);

  useEffect(() => {
    if(resDelete?.isSuccess) {
      refetch()
    }
  }, [resDelete?.isSuccess])

  return (
    <div className="relative z-50">
      {openModal && (
        <Modal setOpen={setOpenModal}>
          <div className="modal_container bg-white w-3/4 p-[20px] z-[60] rounded-lg">
            <ImCross
              onClick={() => setOpenModal(false)}
              className="text-[#242424] hover:text-red-700 cursor-pointer float-right"
              size={20}
            />
            <h1 className="uppercase text-center text-3xl font-bold">Order</h1>
            <p className="mt-3 font-semibold text-lg">Customer Informations</p>
            <hr className="mt-[5px] mb-[10px] h-[1.5px]" />
            <div className="grid grid-cols-5 gap-4 items-center justify-center mb-3">
              <div>
                <p>Name:</p>
              </div>
              <input
                value={infoUser.name}
                className="col-span-4 w-full border-2 py-1 px-3 rounded-lg bg-transparent outline-none leading-4 text-md text-[#333] placeholder:text-#aaa"
                placeholder="Enter customer name"
                onChange={(e) =>
                  dispatch(setInfoUser({ ...infoUser, name: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-5 gap-4 items-center justify-center mb-3">
              <div>
                <p>Adress:</p>
              </div>
              <input
                value={infoUser.address}
                className="col-span-4 w-full border-2 py-1 px-3 rounded-lg bg-transparent outline-none leading-4 text-md text-[#333] placeholder:text-#aaa"
                placeholder="Address..."
                onChange={(e) =>
                  dispatch(
                    setInfoUser({ ...infoUser, address: e.target.value })
                  )
                }
              />
            </div>

            <div className="grid grid-cols-5 gap-4 items-center justify-center mb-3">
              <div>
                <p>Phone:</p>
              </div>
              <input
                value={infoUser.phone}
                className="col-span-4 w-full border-2 py-1 px-3 rounded-lg bg-transparent outline-none leading-4 text-md text-[#333] placeholder:text-#aaa"
                placeholder="Phone Number..."
                onChange={(e) =>
                  dispatch(setInfoUser({ ...infoUser, phone: e.target.value }))
                }
              />
            </div>
            <p className="mt-5 font-semibold text-lg">Product Informations</p>
            <hr className="mt-3" />
            <div className="h-[300px] overflow-y-scroll">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 text-center">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      image
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      name
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      color
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      size
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      quantities
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      price
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart &&
                    cart.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          <img
                            src={`/${
                              import.meta.env.VITE_PATH_IMAGE
                            }/products/${item.images[0]}`}
                            alt="image product"
                            className="w-20 h-20 rounded-md object-cover"
                          />
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          {item.name}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          <span
                            className="block w-[25px] h-[25px] rounded-full"
                            style={{
                              backgroundColor: item.color,
                              margin: '0 auto',
                            }}
                          ></span>
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          {item.size}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          {currency.format(
                            discount(item.price, item.discount),
                            {
                              code: 'USD',
                            }
                          )}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-700">
                          {item.quantity * discount(item.price, item.discount)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="w-full flex justify-end items-center gap-x-[20px]">
              <button
                onClick={() => {
                  if (!infoUser.phone || !infoUser.address || !infoUser.name) {
                    return;
                  } else {
                    createOrder({
                      userId: user?.id,
                      fullname: infoUser.name,
                      address: infoUser.address,
                      phone: infoUser.phone,
                      cart: cart,
                    });
                  }
                }}
                className="py-2 px-3 bg-green-700 text-sm font-medium text-white rounded hover:bg-green-600"
              >
                Purchase
              </button>
              <p className="text-center font-semibold">
                {' '}
                {currency.format(total, { code: 'USD' })}
              </p>
            </div>
          </div>
        </Modal>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container w-4/5 pb-10 pt-5"
        style={{ margin: '0 auto' }}
      >
        {cart.length > 0 ? (
          <>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="thead-tr text-center uppercase">
                    <th className="th">image</th>
                    <th className="th">name</th>
                    <th className="th">color</th>
                    <th className="th">size</th>
                    <th className="th">price</th>
                    <th className="th">quantities</th>
                    <th className="th">total</th>
                    <th className="th">delete</th>
                  </tr>
                </thead>
                <tbody className="">
                  {cart.map((item, index) => {
                    const total = currency.format(
                      discount(item.price, item.discount) * item.quantity,
                      {
                        code: 'USD',
                      }
                    );
                    return (
                      <tr className="even:bg-gray-50 p-2" key={index}>
                        <td className="td">
                          <img
                            src={`/${
                              import.meta.env.VITE_PATH_IMAGE
                            }/products/${item.images[0]}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-full"
                            style={{ margin: '0 auto' }}
                          />
                        </td>
                        <td className="p-2 td font-medium">{item.name}</td>
                        <td className="p-2 td">
                          <span
                            className="block w-[25px] h-[25px] rounded-full"
                            style={{
                              backgroundColor: item.color,
                              margin: '0 auto',
                            }}
                          ></span>
                        </td>
                        <td className="td text-center">
                          <span className="font-semibold">{item.size}</span>
                        </td>
                        <td className="td font-bold text-gray-900 text-center">
                          {currency.format(
                            discount(item.price, item.discount),
                            {
                              code: 'USD',
                            }
                          )}
                        </td>
                        <td className="td p-2">
                          <Quantity
                            className=""
                            quantity={item.quantity}
                            inc={() => inc(index)}
                            dec={() => dec(index)}
                            theme="indigo"
                          />
                        </td>
                        <td className="td font-bold text-center">{total}</td>
                        <td className="td">
                          <BsTrash
                            className="text-rose-600 cursor-pointer"
                            style={{ margin: '0 auto' }}
                            onClick={() => remove(item.id)}
                            size={20}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-indigo-50 p-4 flex justify-end mt-5 rounded-md">
              <div>
                <span className="text-lg font-semibold text-indigo-800 mr-10">
                  {currency.format(total, { code: 'USD' })}
                </span>
                <button
                  className="btn bg-green-700 text-sm font-medium p-2.5 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    // pay();
                    setOpenModal(true);
                  }}
                >
                 Order
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md text-sm font-medium text-red-700">
            Cart is empty!
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
