/**
 * Module dependencies.
 */
const express = require("express");
const { cartController } = require("../../controllers");
const Authorization = require("../../services/Authorization");

const router = express.Router();

router.route("/").post(Authorization.authorized, cartController.createCart);

router
  .route("/:id")
  .put(Authorization.authorized, cartController.updateCart)
  .delete(Authorization.authorized, cartController.deleteCart);

router
  .route("/user/:id")
  .get(Authorization.authorized, cartController.getCartByUser);

module.exports = router;
