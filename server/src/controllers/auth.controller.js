/**
 * Module dependencies.
 */
const { User } = require("../models");
const { authService } = require("../services");
const { validationResult } = require("express-validator");

/**
 * @route POST /api/v1/login
 * @access Public
 * @desc Login user and return a token
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const user = await User.findOne({ username });

      if (user) {
        if (await authService.comparePassword(password, user.password)) {
          const token = authService.createToken({
            id: user.id,
            fullname: user.fullname,
          });
          if (user.admin) {
            return res.status(201).json({ token, admin: true });
          } else {
            return res.status(201).json({ token, admin: false });
          }
        } else {
          return res.status(400).json({
            errors: [{ msg: "Incorrect Username or Password!", param: "user" }],
          });
        }
      } else {
        return res.status(400).json({
          errors: [{ msg: "Incorrect Username or Password!", param: "user" }],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  } else {
    //  validations failed
    return res.status(400).json({ errors: errors.array() });
  }
};

/**
 * @route POST /api/v1/register
 * @access Public
 * @desc Create user and return a token
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { fullname, username, email, password } = req.body;
    try {
      const userExist = await User.findOne({ username });
      if (!userExist) {
        const hashed = await authService.hashedPassword(password);
        const user = await User.create({
          fullname,
          username,
          email,
          password: hashed,
        });
        const token = authService.createToken({
          id: user._id,
          fullname: user.fullname,
        });
        return res
          .status(201)
          .json({ msg: "Your account has been created!", token });
      } else {
        // email already taken
        return res.status(400).json({
          errors: [{ msg: `${username} is already taken`, param: "username" }],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  } else {
    // validations failed
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = {
  login,
  register,
};
