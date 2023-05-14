const { PATH_UPLOAD_FILE } = require("../../config/envConfig");

/**
 * Module dependencies.
 */
const fs = require("fs");
const { validationResult } = require("express-validator");
const { Category } = require("../models");

const create = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { file, body } = req;

    if (file !== undefined) {
      body.image = file.filename;
    }

    const exist = await Category.findOne({ name: body.name });

    if (!exist) {
      await Category.create(body);
      return res
        .status(201)
        .json({ message: "Your category has created successfully!" });
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: `${body.name} category is already exist` }] });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const paginate = async (req, res) => {
  const page = req.params.page;
  const perPage = 5;
  const skip = (page - 1) * perPage;

  try {
    const count = await Category.find({}).countDocuments();
    const response = await Category.find({})
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });
    //   console.log(response);
    return res.status(200).json({ categories: response, perPage, count });
  } catch (error) {
    console.log(error.message);
  }
};

const fetch = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Category.findOne({ _id: id });
    return res.status(200).json({ category: response });
  } catch (error) {
    console.log(error.message);
  }
};

const update = async (req, res) => {
  console.log("body: ", req.body);
  const { id } = req.params;
  const { name, description } = req.body;
  const { file } = req;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const category = await Category.findById(id);
    const filePath = PATH_UPLOAD_FILE + "categories/";

    if (category) {
      if (file !== undefined) {
        if (category.image != "categoryDefault.jpg") {
          fs.unlinkSync(filePath + category.image);
        }
        req.body.image = file.filename;
      }

      Object.assign(category, req.body);
      await category.save();

      return res
        .status(200)
        .json({ message: "Your category has updated successfully!" });
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: `${name} category is already exist` }] });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const filePath = PATH_UPLOAD_FILE + "categories/";
    const category = await Category.findById(id);

    if (category) {
      if (category.image != "categoryDefault.jpg") {
        fs.unlinkSync(filePath + category.image);
      }
      await Category.findByIdAndDelete(id);

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

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json("Server internal error!");
  }
};

const randomCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([{ $sample: { size: 3 } }]);
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json("Server internal error!");
  }
};

module.exports = {
  create,
  paginate,
  fetch,
  update,
  deleteCategory,
  getAllCategories,
  randomCategories,
};
