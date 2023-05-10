/**
 * Import Components
 */
import React from "react";
import { Link } from "react-router-dom";
import currency from "currency-formatter";
import { motion } from "framer-motion";

import { AiFillStar } from "react-icons/ai";

const ProductCard = ({ product, handleSetBreadCrumb }) => {
  const percentage = product.discount / 100;
  const discountPrice = product.price - product.price * percentage;
  let result = 0;
  let one = 0,
    two = 0,
    three = 0,
    four = 0,
    five = 0,
    total = 0;
  if (product?.reviews?.length > 0) {
    product?.reviews?.forEach((item) => {
      if (item.rating === 1) {
        one += 1;
      }
      if (item.rating === 2) {
        two += 1;
      }
      if (item.rating === 3) {
        three += 1;
      }
      if (item.rating === 4) {
        four += 1;
      }
      if (item.rating === 5) {
        five += 1;
      }
    });
    total = one + two + three + four + five;
    result = (1 * one + 2 * two + 3 * three + 4 * four + 5 * five) / total;
  } else {
    total = 0;
    result = 0;
  }
  const finalResult = parseFloat(result).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full rounded-md shadow transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-103 hover:shadow-md"
      key={product._id}
    >
      <Link to={`/product/${product.id}`}>
        <div className="w-full" onClick={() => handleSetBreadCrumb()}>
          <img
            src={`/${import.meta.env.VITE_PATH_IMAGE}/products/${
              product.images[0]
            }`}
            alt="product image"
            className="w-full h-[200px] object-cover"
          />
        </div>
        <div className="mx-3 mb-3">
          <p className="capitalize text-base font-medium text-black my-2.5">
            {product.name}
          </p>
          <div className="flex items-center">
            <div className="flex items-center space-x-2 mb-1">
              <span>{finalResult}</span>
              <AiFillStar color="orange" />
              <span>({total})</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-medium text-black">
              {currency.format(discountPrice, { code: "USD" })}
            </span>
            <span className="text-lg font-medium text-yellow-500 line-through">
              {currency.format(product.price, { code: "USD" })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
