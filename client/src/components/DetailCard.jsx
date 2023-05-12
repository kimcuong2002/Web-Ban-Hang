import { useState, useRef, useEffect } from "react";
import currency from "currency-formatter";
import { motion } from "framer-motion";
import h2p from "html2plaintext";
import htmlParser from "html-react-parser";
import toast, { Toaster } from "react-hot-toast";
import { BsCheck2 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Quantity from "./Quantity";
import { addCart } from "../redux/reducers/cartReducer";
import { discount } from "../utils/discount";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
import { Navigation } from "swiper";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "../redux/services/userOrdersService";

const DetailsCard = ({ product }) => {
  const [sizeState, setSizeState] = useState(
    product?.sizes?.length > 0 && product.sizes[0]
  );
  const [colorState, setColorState] = useState(
    product?.colors?.length > 0 && product.colors[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [idOrder, setIdOrder] = useState("");
  const inc = () => {
    setQuantity(quantity + 1);
  };
  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const [imageRenderDetail, setImageRenderDetail] = useState(0);

  const { user } = useSelector((state) => state.authReducer);
  const { statusOrder } = useSelector((state) => state.orderReducer);

  const [createOrder, res] = useCreateOrderMutation();
  const [updateOrder, response] = useUpdateOrderMutation();

  const handlePreviewProdduct = (index) => {
    setImageRenderDetail(index);
  };

  useEffect(() => {
    if (res?.isSuccess) {
      setIdOrder(res?.data?.order.id);
      localStorage.setItem("orderId", res?.data?.order.id);
    }
  }, [res?.isSuccess]);

  const discountPrice = discount(product.price, product.discount);
  let desc = h2p(product.description);
  desc = htmlParser(desc);
  const dispatch = useDispatch();

  const addToCart = () => {
    const {
      ["colors"]: colors,
      ["sizes"]: sizes,
      ["createdAt"]: createdAt,
      ["updatedAt"]: updatedAt,
      ...newProduct
    } = product;
    newProduct["size"] = sizeState;
    newProduct["color"] = colorState;
    newProduct["quantity"] = quantity;
    const cart = localStorage.getItem("cart");
    const cartItems = cart ? JSON.parse(cart) : [];
    const checkItem = cartItems.find(
      (item) =>
        item.id === newProduct.id &&
        item.size === newProduct.size &&
        item.color === newProduct.color
    );
    if (cartItems.length === 0) {
      dispatch(addCart(newProduct));
      cartItems.push(newProduct);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      toast.success(`${newProduct.name} successfully added to cart`);
      createOrder({
        userId: user?.id,
        address: "empty",
        phone: "empty",
        status: statusOrder,
        cart: [newProduct],
      });
    } else {
      if (!checkItem) {
        dispatch(addCart(newProduct));
        cartItems.push(newProduct);
        const result = {
          userId: user?.id,
          address: "empty",
          phone: "empty",
          status: statusOrder,
          cart: cartItems,
        };
        const id = localStorage.getItem("orderId");
        if (idOrder) {
          updateOrder({ id: idOrder, body: result });
        } else {
          updateOrder({ id: id, body: result });
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
        toast.success(`${newProduct.name} successfully added to cart`);
      } else {
        toast.error(`${newProduct.name} is already in cart`);
        return;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap -mx-5"
    >
      <Toaster />
      <div className="w-full order-2 md:order-1 md:w-6/12 p-5">
        <img
          src={`../${import.meta.env.VITE_PATH_IMAGE}/products/${
            product.images[imageRenderDetail]
          }`}
          alt=""
          className="w-[350px] h-[350px] object-cover mx-auto mb-5"
        />
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >
          {product.images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="w-[350px]"
              onClick={() => handlePreviewProdduct(index)}
            >
              {" "}
              <img
                src={`../${import.meta.env.VITE_PATH_IMAGE}/products/${image}`}
                alt="image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* <div className="w-full order-2 md:order-1 md:w-6/12 p-5">
        {product.images.length > 0 && (
          <>
            <div className="flex">
              
            </div>
          </>
        )}
      </div> */}
      <div className="w-full order-1 md:order-2 md:w-6/12 p-5">
        <h1 className="text-2xl font-bold text-gray-900 capitalize">
          {product.name}
        </h1>
        <div className="flex gap-7 items-start my-5">
          <span className="text-2xl font-bold text-gray-900">
            {" "}
            {currency.format(discountPrice, { code: "USD" })}
          </span>
          <span className="text-xl line-through text-yellow-500">
            {currency.format(product.price, { code: "USD" })}
          </span>
        </div>

        {product.sizes.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-3">
              sizes
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.sizes.map((size) => (
                <div
                  className={`p-2 m-1 border border-gray-300 rounded cursor-pointer ${
                    sizeState === size && "bg-green-600"
                  }`}
                  key={size}
                  onClick={() => setSizeState(size)}
                >
                  <span
                    className={`text-sm font-semibold uppercase  ${
                      sizeState === size ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {size}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {product.colors.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
              colors
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setColorState(color)}
                  className={`border border-gray-300 rounded m-1 p-1 cursor-pointer ${
                    colorState === color && "border-green-600"
                  }`}
                >
                  <span
                    className="min-w-[40px] min-h-[40px] rounded flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {colorState === color && (
                      <BsCheck2 className="text-white" size={20} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex -mx-3 items-center">
          <div className="w-full sm:w-6/12 p-3">
            <Quantity quantity={quantity} inc={inc} dec={dec} />
          </div>
          <button
            className="uppercase w-full sm:w-6/12 p-3 text-center rounded-md border border-gray-300 m-1 cursor-pointer hover:bg-green-700 hover:text-white"
            onClick={addToCart}
          >
            add to cart
          </button>
        </div>
        <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
          description
        </h3>
        <div className="mt-4 leading-[27px] description">{desc}</div>
      </div>
    </motion.div>
  );
};

export default DetailsCard;
