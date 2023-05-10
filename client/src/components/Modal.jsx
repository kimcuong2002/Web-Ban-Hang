import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { discount } from "../utils/discount";
import currency from "currency-formatter";
import { useDispatch, useSelector } from "react-redux";
import { setInfoUser } from "../redux/reducers/orderReducer";

const Modal = ({ setOpen, cart, total }) => {
  const { infoUser } = useSelector((state) => state.orderReducer);
  const dispatch = useDispatch();
  console.log(infoUser);
  return (
    <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] w-full h-[100vh] z-9 flex justify-center items-center">
      <a
        className="fixed top-0 left-0 w-full h-[100vh] z-10"
        onClick={() => setOpen(false)}
      ></a>
      <div className="modal_container bg-white w-[70%] p-[20px] z-20">
        <div className="flex justify-between text-[30px] uppercase">
          <p>Cart</p>
          <AiOutlineCloseCircle
            onClick={() => setOpen(false)}
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
              dispatch(setInfoUser({ ...infoUser, address: e.target.value }))
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
        <p className="font-[17px] mt-[20px] font-bold">Product Informations</p>
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
                  <div className="w-full flex uppercase justify-between items-center text-center">
                    <div className="w-[20%] flex justify-center">
                      <img
                        src={`/${import.meta.env.VITE_PATH_IMAGE}/products/${
                          item.images[0]
                        }`}
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
                      {currency.format(discount(item.price, item.discount), {
                        code: "USD",
                      })}
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
          <button className="border-2 py-[5px] px-[10px] rounded-[7px] border-cyan-500 text-cyan-500 hover:bg-cyan-500 border-white hover:text-black">
            Purchase
          </button>
          <p className="w-[10%] text-center">
            {" "}
            {currency.format(total, { code: "USD" })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
