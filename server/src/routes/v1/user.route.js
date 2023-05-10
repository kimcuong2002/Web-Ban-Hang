const { PATH_UPLOAD_FILE } = require("../../../config/envConfig");

/**
 * Module dependencies.
 */
const express = require("express");
const multer = require("multer");
const { userValidation } = require("../../validations");
const { authController, userController } = require("../../controllers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH_UPLOAD_FILE + "users/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    console.log(file);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        file.originalname.replaceAll(" ", ""),
    );
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("")
  .post(
    userValidation.createValidations,
    upload.single("avatar"),
    userController.createUser,
  )
  .get(userController.getUsers);

router
  .route("/register")
  .post(userValidation.registerValidations, authController.register);

router
  .route("/login")
  .post(userValidation.loginValidations, authController.login);

router
  .route("/update")
  .patch(upload.single("avatar"), userController.updateUser);

router.route("/delete/:id").delete(userController.deleteUser);

router.route("/pages/:page").get(userController.paginate);

module.exports = router;
