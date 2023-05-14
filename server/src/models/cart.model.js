const { Schema, Types, model } = require("mongoose");
const { toJSON } = require("./plugins");

const cartSchema = Schema(
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
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);

/**
 * @typedef Cart
 */
const Cart = model("Cart", cartSchema);

module.exports = Cart;
