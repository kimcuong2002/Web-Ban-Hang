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
    const { page, productId } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;
  
    try {
      const count = await Review.find({product: productId}).countDocuments();
      Review.find({product: productId}).populate([
        // here array is for our memory. 
        // because may need to populate multiple things
        {
            path: 'user',
            select: ['name', 'avatar'],
            model:'User',
            options: {
                sort:{ },
                skip: skip,
                limit : limit
            },
            match:{
            }
        }
    ]).exec((err, story) => {
        if(err){
         return err;
        } else {
          return res.status(200).json({reviews: story, page: page, count: count})
        }
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
