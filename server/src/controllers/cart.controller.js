/**
 * Module dependencies.
 */
const { validationResult } = require("express-validator");
const { Product, Cart } = require("../models");

const createCart = async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body)
  if (errors.isEmpty()) {
    const { body } = req;

    const cart = await Cart.create(body);
    return res.status(201).json({ msg: "Cart created successfully", cart });
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const getCartByUser = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const result = await Cart.find({ userId: req.params.id });
    if(result.length === 0 || result.length === 1) {
      return res.status(200).json({cart: result});
    } else {
      const cart = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return res.status(200).json({ cart: [cart[0]] });
    }
    
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const updateCart = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { id } = req.params;
    const { body } = req;

    try {
      const cart = await Cart.findById(id);

      if (cart) {
        Object.assign(cart, body);
        await cart.save();
        return res.status(200).json({ msg: "Cart has updated", cart });
      } else {
        return res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ errors: error });
    }
  } else {
    return res.status(400).json({ errors: errors.array() });
  }
};

const deleteCart = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { id } = req.params;

    try {
      const cart = await Cart.findById(id);

      if (cart) {
        await Cart.findByIdAndDelete(id);
        return res.status(200).json({ msg: "Cart has deleted" });
      } else {
        return res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ errors: error });
    }
  } else {
    console.log(errors.message);
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = {
  createCart,
  getCartByUser,
  updateCart,
  deleteCart,
};
