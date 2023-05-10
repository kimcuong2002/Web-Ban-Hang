const { body } = require("express-validator");

const createValidations = [
  body("fullname")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Fullname is required"),
  body("username")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Username is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("Email is required"),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be 6 characters long"),
  body("avatar")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Avatar is required"),
];

const registerValidations = [
  body("fullname")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Fullname is required"),
  body("username")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Username is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .withMessage("Email is required"),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be 6 characters long"),
];

const loginValidations = [
  body("username")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Username is required!"),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be 6 characters long"),
];

module.exports = {
  createValidations,
  loginValidations,
  registerValidations,
};
