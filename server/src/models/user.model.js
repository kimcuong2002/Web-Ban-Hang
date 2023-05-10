let mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      required: true,
      type: String,
    },
    avatar: {
      type: String,
      default: "userDefault.png",
      required: true,
    },
    admin: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
