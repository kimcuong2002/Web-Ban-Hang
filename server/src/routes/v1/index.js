const express = require("express");
const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const orderRoute = require("./order.route");
const paymentRoute = require("./payment.route");
const cartRoute = require("./cart.route");
const reviewRoute = require("./review.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
  {
    path: "/carts",
    route: cartRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
