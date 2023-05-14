const { Product, Category } = require("../models");

const catProducts = async (req, res) => {
  const { name, page, keyword } = req.params;
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const category = await Category.findOne({ name });

  const options = name
    ? { category: category.id }
    : keyword && { name: { $regex: `${keyword}`, $options: "i" } };

  if (page) {
    try {
      const count = await Product.find({
        ...options,
      })
        .where("stock")
        .gt(0)
        .countDocuments()
        .populate("category");
      const response = await Product.find({ ...options })
        .where("stock")
        .gt(0)
        .skip(skip)
        .limit(perPage)
        .populate("category")
        // .populate("reviews")
        .sort({ updatedAt: -1 });

      if (category) {
        return res.status(200).json({
          products: response,
          perPage,
          count,
          imageCategory: category.image,
        });
      } else {
        return res.status(200).json({
          products: response,
          perPage,
          count,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  } else {
    const response = await Product.find({ ...options })
      .where("stock")
      .gt(0)
      .limit(4)
      // .populate("reviews")
      .sort({ updatedAt: -1 });
    return res
      .status(200)
      .json({ products: response, imageCategory: category.image });
  }
};

module.exports = { catProducts };
