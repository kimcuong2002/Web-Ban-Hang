const { PATH_UPLOAD_FILE } = require("../../../config/envConfig");

/**
 * Module dependencies.
 */
const express = require("express");
const multer = require("multer");

const { categoryValidation } = require("../../validations");
const { categoryController } = require("../../controllers");
const Authorization = require("../../services/Authorization");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH_UPLOAD_FILE + "categories/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);

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
  .route("/")
  .post(
    [categoryValidation, Authorization.authorized],
    upload.single("image"),
    categoryController.create,
  )
  .get(categoryController.getAllCategories);

router.route("/random").get(categoryController.randomCategories);

router
  .route("/pages/:page")
  .get(Authorization.authorized, categoryController.paginate);

router
  .route("/:id")
  .get(Authorization.authorized, categoryController.fetch)
  .patch(
    [categoryValidation, Authorization.authorized],
    upload.single("image"),
    categoryController.update,
  )
  .delete(Authorization.authorized, categoryController.deleteCategory);

module.exports = router;
