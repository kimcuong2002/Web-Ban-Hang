const { PATH_UPLOAD_FILE } = require("../../config/envConfig");

/**
 * Module dependencies.
 */
const fs = require("fs");
const { User } = require("../models");
const { authService } = require("../services");
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    console.log(req.body);
    return res.status(400).json({ errors: errors.array() });
    // const { fullname, username, email, password, admin } = req.body;
    // const { file } = req;

    // try {
    //   const userExist = await User.findOne({ username });

    //   if (!userExist) {
    //     const hashed = await authService.hashedPassword(password);

    //     if (file !== undefined) {
    //       req.body.avatar = file.filename;
    //     }

    //     await User.create({
    //       fullname,
    //       username,
    //       email,
    //       password: hashed,
    //       avatar: req.body.avatar,
    //       admin,
    //     });

    //     return res.status(200).json({ msg: "Your account has been created" });
    //   } else {
    //     // email already taken
    //     return res.status(400).json({
    //       errors: [{ msg: `${username} is already taken`, param: "username" }],
    //     });
    //   }
    // } catch (error) {
    //   console.log(error.message);
    //   return res.status(500).json("Server internal error!");
    // }
  } else {
    // validations failed
    return res.status(400).json({ errors: errors.array() });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    return error;
  }
};

const updateUser = async (req, res) => {
  const { id, fullname, username, email, password, admin } = req.body;
  const { file } = req;

  try {
    const filePath = PATH_UPLOAD_FILE + "users/";
    const user = await User.findById(id);

    if (user) {
      if (file !== undefined) {
        if (user.avatar != "userDefault.png") {
          fs.unlinkSync(filePath + user.avatar);
        }
        req.body.avatar = file.filename;
      }
      const hashed = await authService.hashedPassword(password);

      Object.assign(user, {
        fullname,
        username,
        email,
        password: hashed,
        avatar: req.body.avatar,
        admin,
      });
      await user.save();

      return res.status(200).json({ msg: "User has updated", user });
    } else {
      return res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const filePath = PATH_UPLOAD_FILE + "users/";
    const user = await User.findById(id);

    if (user) {
      if (user.avatar != "userDefault.png") {
        fs.unlinkSync(filePath + user.avatar);
      }
      await User.findByIdAndDelete(id);

      return res
        .status(200)
        .json({ message: "User has deleted successfully!" });
    } else {
      return res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    return res.status(500).json("Server internal error!");
  }
};

const paginate = async (req, res) => {
  const page = req.params.page;
  const perPage = 5;
  const skip = (page - 1) * perPage;

  try {
    const count = await User.find({}).countDocuments();
    const response = await User.find({})
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });
    //   console.log(response);
    return res.status(200).json({ users: response, perPage, count });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser, paginate };
