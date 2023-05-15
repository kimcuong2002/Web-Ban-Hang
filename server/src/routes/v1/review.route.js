/**
 * Module dependencies.
 */
const express = require("express");

const Authorization = require("../../services/Authorization");
const { reviewController } = require("../../controllers");

const router = express.Router();

router
  .route("")
  .get(reviewController.getReviews)
  .post(Authorization.authorized, reviewController.createRating);

module.exports = router;
