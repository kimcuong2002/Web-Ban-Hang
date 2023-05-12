/**
 * Module dependencies.
 */
const express = require("express");
const { orderController } = require("../../controllers");
const Authorization = require("../../services/Authorization");
const { ratingValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  .get(Authorization.authorized, orderController.paginate)
  .post(Authorization.authorized, orderController.createOrder);

router
  .route("/add-review")
  .post(
    [Authorization.authorized, ratingValidation],
    orderController.createRating
  );

router
  .route("/:id")
  .get(Authorization.authorized, orderController.orderDetail)
  .put(Authorization.authorized, orderController.updateOrder)
  .delete(Authorization.authorized, orderController.deleteOrder);

router
  .route("/user/:id")
  .get(Authorization.authorized, orderController.getOrderByUser);

module.exports = router;
