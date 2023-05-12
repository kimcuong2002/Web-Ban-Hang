import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import currency from "currency-formatter";
import { BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { discount } from "../utils/discount";
import useToastify from "../hooks/useToatify";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Quantity from "../components/Quantity";
import { setCart, setTotal } from "../redux/reducers/cartReducer";
import {
  incQuantity,
  decQuantity,
  removeItem,
} from "../redux/reducers/cartReducer";
import { useSendPaymentMutation } from "../redux/services/paymentService";
import {
  useUpdateOrderMutation,
  useGetOrderByIdUserQuery,
  useDeleteOrderMutation,
  useCreateOrderMutation,
} from "../redux/services/userOrdersService";
import Modal from "../components/Modal";
import { setInfoUser } from "../redux/reducers/orderReducer";

const Cart = () => {
  const [openModal, setOpenModal] = useState(false);
  const { cart, total } = useSelector((state) => state.cartReducer);
  const { statusOrder, infoUser } = useSelector((state) => state.orderReducer);
  const { userToken, user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const toast = useToastify();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [createOrder, res] = useCreateOrderMutation();
  const { data } = useGetOrderByIdUserQuery(user?.id);
  const navigate = useNavigate();
  const [doPayment, response] = useSendPaymentMutation();
  const inc = (i) => {
    dispatch(incQuantity(i));
  };
  const dec = (i) => {
    dispatch(decQuantity(i));
  };
  const remove = (id) => {
    // verify user that you are really want to delete the project or item
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(removeItem(id));
    }
  };
  const pay = () => {
    if (userToken) {
      doPayment({ cart, id: user.id });
      toast.handleOpenToastify("success", "Purchase successfully!", 1000);
      dispatch(setCart([]));
      localStorage.removeItem("cart");
      dispatch(setInfoUser({ name: "", address: "", phone: "" }));
      localStorage.removeItem("orderId");
      setOpenModal(false);
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (user && data) {
      const cartLocal = JSON.parse(localStorage.getItem("cart"));
      if (!data.order.length) return [];
      let arr = data.order[0].cart;
      if (!cartLocal) {
        for (let i = 1; i < data?.order.length; i++) {
          for (let j = 0; j < data?.order[i].cart.length; j++) {
            const product = data?.order[i]?.cart[j];
            const index = arr.findIndex(
              (item) =>
                item.name === product?.name &&
                item.color === product?.color &&
                item.size === product?.size
            );
            if (index === -1) {
              arr = [...arr, product];
            }
          }
        }
      } else {
        for (let i = 1; i < data?.order.length; i++) {
          for (let j = 0; j < data?.order[i].cart.length; j++) {
            const product = data?.order[i]?.cart[j];
            const index = arr.findIndex(
              (item) =>
                item.name === product?.name &&
                item.color === product?.color &&
                item.size === product?.size
            );
            if (index === -1) {
              arr = [...arr, product];
            }
          }
        }
        for (const cart of cartLocal) {
          const index = arr.findIndex(
            (item) =>
              item.name === cart.name &&
              item.color === cart.color &&
              item.size === cart.size
          );
          if (index === -1) {
            arr = [...arr, cart];
          }
        }
      }
      let total = 0;
      for (let a of arr) {
        a = { ...a, quantity: 1 };
        total += discount(a.price, a.discount);
      }
      dispatch(setCart(arr));
      dispatch(setTotal(total));
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("orderId");
    if (id) {
      if (cart.length) {
        updateOrder({
          id: id,
          body: {
            cart: cart,
          },
        });
      } else {
        deleteOrder(id);
        localStorage.removeItem("orderId");
      }
    } else {
      console.log(cart);
      if (cart.length !== 0) {
        createOrder({
          userId: user?.id,
          status: statusOrder,
          cart: cart,
        });
      }
    }
  }, [cart]);

  useEffect(() => {
    if (res?.isSuccess) {
      localStorage.setItem("orderId", res?.data?.order.id);
    }
  }, [res?.isSuccess]);

  useEffect(() => {
    if (response?.isSuccess) {
      window.location.href = response?.data?.url;
      dispatch(setCart([]));
      dispatch(setInfoUser({ name: "", address: "", phone: "" }));
      localStorage.removeItem("orderId");
      setOpenModal(false);
      toast.handleOpenToastify("success", "Purchase successfully!", 1000);
    }
  }, [response]);

  return (
    <div className="relative">
      {openModal && (
        <Modal setOpen={setOpenModal}>
          <div className="modal_container bg-white w-[70%] p-[20px] z-20">
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
                {" "}
                Name:
              </p>
              <input
                value={infoUser.name}
                className="border-2 w-[75%] py-[5px] px-[10px] rounded-[10px]"
                placeholder="Enter customer name"
                onChange={(e) =>
                  dispatch(setInfoUser({ ...infoUser, name: e.target.value }))
                }
              />
            </div>
            <div className="w-[70%] flex mb-[20px]">
              <p htmlFor="" className="text-[17px] mr-[10px] w-[25%]">
                {" "}
                Adress:
              </p>
              <input
                value={infoUser.address}
                className="border-2 w-[75%] py-[5px] px-[10px] rounded-[10px]"
                placeholder="Enter customer adress"
                onChange={(e) =>
                  dispatch(
                    setInfoUser({ ...infoUser, address: e.target.value })
                  )
                }
              />
            </div>
            <div className="w-[70%] flex mb-[20px]">
              <p htmlFor="" className="text-[17px] mr-[10px] w-[25%]">
                {" "}
                Phone:
              </p>
              <input
                value={infoUser.phone}
                className="border-2 w-[75%] py-[5px] px-[10px] rounded-[10px]"
                placeholder="Enter customer phone number"
                onChange={(e) =>
                  dispatch(setInfoUser({ ...infoUser, phone: e.target.value }))
                }
              />
            </div>
            <p className="font-[17px] mt-[20px] font-bold">
              Product Informations
            </p>
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
                {cart &&
                  cart.map((item, index) => {
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
                          {" "}
                          <span
                            className="block w-[25px] h-[25px] rounded-full"
                            style={{
                              backgroundColor: item.color,
                              margin: "0 auto",
                            }}
                          ></span>
                        </div>
                        <p className="w-[10%]">{item.size}</p>
                        <p className="w-[10%]">{item.quantity}</p>
                        <p className="w-[10%]">
                          {currency.format(
                            discount(item.price, item.discount),
                            {
                              code: "USD",
                            }
                          )}
                        </p>
                        <p className="w-[10%] ">
                          {item.quantity * discount(item.price, item.discount)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="w-[100%] flex justify-end gap-x-[20px]">
              <button
                onClick={() => {
                  if (!infoUser.phone || !infoUser.address || !infoUser.name) {
                    return;
                  } else {
                    const id = localStorage.getItem("orderId");
                    if (id) {
                      updateOrder({
                        id: id,
                        body: {
                          fullname: infoUser.name,
                          address: infoUser.address,
                          phone: infoUser.phone,
                          status: "DELIVERED",
                        },
                      });
                      pay();
                    } else {
                      return;
                    }
                  }
                }}
                className="border-2 py-[5px] px-[10px] rounded-[7px] border-cyan-500 text-cyan-500 hover:bg-cyan-500 border-white hover:text-black"
              >
                Purchase
              </button>
              <p className="w-[10%] text-center">
                {" "}
                {currency.format(total, { code: "USD" })}
              </p>
            </div>
          </div>
        </Modal>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container w-4/5 pb-10 pt-5"
        style={{ margin: "0 auto" }}
      >
        <Toaster />
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
                        code: "USD",
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
                            style={{ margin: "0 auto" }}
                          />
                        </td>
                        <td className="p-2 td font-medium">{item.name}</td>
                        <td className="p-2 td">
                          <span
                            className="block w-[25px] h-[25px] rounded-full"
                            style={{
                              backgroundColor: item.color,
                              margin: "0 auto",
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
                              code: "USD",
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
                            style={{ margin: "0 auto" }}
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
                  {currency.format(total, { code: "USD" })}
                </span>
                <button
                  className="btn bg-green-700 text-sm font-medium p-2.5 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    // pay();
                    setOpenModal(true);
                  }}
                >
                  {response.isLoading ? "Loading..." : "Checkout"}
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
