const { PATH_UPLOAD_FILE } = require("../../config/envConfig");

/**
 * Module dependencies.
 */
const { validationResult } = require("express-validator");
const fs = require("fs");
const { Product } = require("../models");

const create = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { files, body } = req;

    const listImages = [];

    if (files.length > 0) {
      files.forEach((e) => {
        listImages.push(e.filename);
      });
      body.images = listImages;
    }
    const product = await Product.create(body);
    return res.status(201).json({ msg: "Product has created", product });
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json("Server internal error!");
  }
};

const paginate = async (req, res) => {
  const { page } = req.params;
  const perPage = 5;
  const skip = (page - 1) * perPage;

  try {
    const count = await Product.find({}).countDocuments();
    const response = await Product.find({})
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });
    return res.status(200).json({ products: response, perPage, count });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const product = await Product.findOne({ _id: id }).populate("category");
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { id } = req.params;
    const { files, body } = req;

    try {
      const product = await Product.findById(id);
      console.log(files);
      if (product) {
        const filePath = PATH_UPLOAD_FILE + "products/";
        const listImages = [];

        if (files.length > 0) {
          product.images.forEach((e) => {
            fs.unlinkSync(filePath + e);
          });

          files.forEach((e) => {
            listImages.push(e.filename);
          });
          body.images = listImages;
        }

        Object.assign(product, body);
        await product.save();
        return res.status(200).json({ msg: "Product has updated", product });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const filePath = PATH_UPLOAD_FILE + "products/";
    const product = await Product.findById(id);

    if (product) {
      product.images.forEach((e) => {
        fs.unlinkSync(filePath + e);
      });

      await Product.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ msg: "Product has been deleted successfully" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getProducts,
  paginate,
  findById,
  update,
  deleteProduct,
};
