/**
 * Module dependencies.
 */
const express = require("express");
const Authorization = require("../../services/Authorization");
const { paymentController } = require("../../controllers");

const router = express.Router();

router.route("/create-checkout-session").post(paymentController.paymentProcess);
// .post(Authorization.authorized, paymentController.paymentProcess);

router.route("/webhook").post(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
  paymentController.checkOutSession,
);

router
  .route("/verify/:id")
  .get(Authorization.authorized, paymentController.paymentVerify);

module.exports = router;
