const { Schema, Types, model } = require("mongoose");
const { toJSON } = require("./plugins");

const reviewSchema = Schema(
  {
    rating: {
      type: Number,
      default: 1,
    },
    comment: String,
    product: { type: Types.ObjectId, ref: "Product" },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);

/**
 * @typedef Review
 */
const Review = model("Review", reviewSchema);

module.exports = Review;
