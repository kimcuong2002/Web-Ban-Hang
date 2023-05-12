const { Schema, Types, model } = require("mongoose");
const { toJSON } = require("./plugins");

const orderSchema = Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    cart: {
      type: [
        {
          name: {
            type: String,
          },
          price: {
            type: Number,
          },
          discount: {
            type: Number,
          },
          stock: {
            type: Number,
          },
          category: {
            type: Types.ObjectId,
            ref: "Category",
          },
          quantity: {
            type: Number,
          },
          color: {
            type: String,
          },
          size: {
            type: String,
          },
          images: [
            {
              type: String,
              required: true,
            },
          ],
          description: {
            type: String,
          },
          reviews: [{ type: Types.ObjectId, ref: "review" }],
        },
      ],
      _id: false,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    fullname: {
      type: String,
    },
    status: {
      type: String,
      default: "WAITTING",
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
