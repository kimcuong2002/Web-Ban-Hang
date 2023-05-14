/**
 * Module dependencies.
 */
const { validationResult } = require("express-validator");
const { Order, Product, Review } = require("../models");

const createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { body } = req;

    const order = await Order.create(body);
    return res.status(201).json({ msg: "Product has created", order });
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const getOrderByUser = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const order = await Order.find({ userId: req.params.id });

    if (order.length === 0) {
      return res.status(200).json({ order });
    } else {
      const result = order.filter(
        (item) => item.cart.length !== 0 && item.status !== "DELIVERED",
      );
      return res.status(200).json({ order: result });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const paginate = async (req, res) => {
  const { page, userId } = req.query;
  const perPage = 5;
  const skip = (page - 1) * perPage;

  try {
    const count = await Order.find({ userId: userId }).countDocuments();
    const response = await Order.find({ userId: userId })
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });
    return res.status(200).json({ orders: response, perPage, count });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};

// const paginateOrders = async (req, res) => {
//   const query = req.query;
//   const perPage = 5;
//   const skip = (query.page - 1) * perPage;
//   const option = query.userId ? { userId: query.userId } : {};

//   try {
//     const count = await Order.find(option).countDocuments();
//     const response = await Order.find(option)
//       .populate("productId", "-colors -sizes -createdAt -updatedAt -stock")
//       .populate("userId", "-password -updatedAt -createdAt -admin")
//       .skip(skip)
//       .limit(perPage)
//       .sort({ createdAt: -1 });
//     // console.log(response);
//     return res.status(200).json({ orders: response, perPage, count });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const orderDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const details = await Order.findById(id);
    return res.status(200).json({ details });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ errors: error });
  }
};

const updateOrder = async (req, res) => {
  console.log("--------------------", req);
  // const errors = validationResult(req);
  // if (errors.isEmpty()) {
  // const { id } = req.params;
  // const { body } = req;

  // try {
  //   const order = await Order.findById(id);

  //   if (order) {
  //     Object.assign(order, body);
  //     await order.save();
  //     return res.status(200).json({ msg: "Order has updated", order });
  //   } else {
  //     return res.status(404).json({ message: "Order not found" });
  //   }
  // } catch (error) {
  //   console.log(error.message);
  //   return res.status(500).json({ errors: error });
  // }
  // } else {
  //   console.log(errors.message);
  //   return res.status(400).json({ errors: errors.array() });
  // }
};

const deleteOrder = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { id } = req.params;

    try {
      const order = await Order.findById(id);

      if (order) {
        await order.remove();
        return res.status(200).json({ msg: "Order has deleted" });
      } else {
        return res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ errors: error });
    }
  } else {
    console.log(errors.message);
    return res.status(400).json({ errors: errors.array() });
  }
};

const createRating = async (req, res) => {
  const errors = validationResult(req);
  const { rating, message, user, product, id } = req.body;
  // console.log(req.body);

  if (errors.isEmpty()) {
    try {
      const createdReview = await Review.create({
        rating: parseInt(rating),
        comment: message,
        product,
        user,
      });
      //   console.log("review created: ", createdReview);
      await Order.findByIdAndUpdate(id, { review: true });
      await Product.findOneAndUpdate(
        { _id: product },
        { $push: { reviews: createdReview._id } },
      );
      return res.status(201).json({ msg: "Review has created successfully" });
    } catch (error) {
      return res.status(500).json({ errors: error.message });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = {
  paginate,
  orderDetail,
  updateOrder,
  deleteOrder,
  createRating,
  createOrder,
  getOrderByUser,
};
