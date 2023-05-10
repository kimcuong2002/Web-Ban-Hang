const { Schema, Types, model } = require("mongoose");
const { toJSON } = require("./plugins");

const productSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      // required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    colors: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
      },
    ],
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
  { timestamps: true },
);
// add plugin that converts mongoose to json
productSchema.plugin(toJSON);

/**
 * @typedef Product
 */
const Product = model("Product", productSchema);

module.exports = Product;
