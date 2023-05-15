/**
 * Module dependencies.
 */
const { validationResult } = require("express-validator");
const fs = require("fs");
const { Order, Product, Review } = require("../models");

const createRating = async (req, res) => {
    const errors = validationResult(req);
    const { rating, message, user, product } = req.body;
    // console.log(req.body);
  
    if (errors.isEmpty()) {
      try {
        const createdReview = await Review.create({
          rating: parseInt(rating),
          comment: message,
          product,
          user,
        });
        await Product.findOneAndUpdate(
          { _id: product },
          { $push: { reviews: createdReview._id } },
        );
        return res.status(201).json({ msg: "Review has created successfully" });
      } catch (error) {
        return res.status(500).json({ errors: error.message });
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  };

  const getReviews = async (req, res) => {
    const { page, productId, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
  
    try {
      const count = await Review.find({product: productId}).countDocuments();

      Review.find({product: productId}).populate([
        {
          path: 'user',
          select: ['username', 'avatar'],
          model: 'User'
        }
      ]).skip(skip).limit(limit).exec((err, story) => {
        if(err) {
          return res.json(err)
        }
        return res.status(200).json({
          reviews: story, limit: limit, count: count, page: page
        })
      })

    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  };

module.exports = {
    createRating,
    getReviews
};
