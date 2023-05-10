const { Schema, Types, model } = require("mongoose");
const { toJSON } = require("./plugins");

const orderSchema = Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    cart: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    review: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);

/**
 * @typedef Order
 */
const Order = model("Order", orderSchema);

module.exports = Order;
