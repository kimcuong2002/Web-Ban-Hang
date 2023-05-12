import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import currency from "currency-formatter";
import { BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { discount } from "../utils/discount";
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

const Cart = () => {
  const [openModal, setOpenModal] = useState(false);
  const { cart, total } = useSelector((state) => state.cartReducer);
  const { statusOrder } = useSelector((state) => state.orderReducer);
  const { userToken, user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [createOrder, res] = useCreateOrderMutation();
  const { data } = useGetOrderByIdUserQuery(user?.id);
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
  }, [user]);

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
    } else if (cart.length) {
      createOrder({
        userId: user?.id,
        address: "empty",
        phone: "empty",
        status: statusOrder,
        cart: cart,
      });
    }
  }, [cart]);

  useEffect(() => {
    if (res?.isSuccess) {
      localStorage.setItem("orderId", res?.data?.order.id);
    }
  }, [res?.isSuccess]);
  const navigate = useNavigate();
  const [doPayment, response] = useSendPaymentMutation();
  // console.log("payment response", response);
  const pay = () => {
    if (userToken) {
      doPayment({ cart, id: user.id });
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (response?.isSuccess) {
      window.location.href = response?.data?.url;
    }
  }, [response]);

  return (
    <div className="relative">
      {openModal && <Modal setOpen={setOpenModal} cart={cart} total={total} />}
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
