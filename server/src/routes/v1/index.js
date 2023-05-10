const express = require("express");
const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const orderRoute = require("./order.route");
const paymentRoute = require("./payment.route");

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
