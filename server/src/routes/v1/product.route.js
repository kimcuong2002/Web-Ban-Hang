const { PATH_UPLOAD_FILE } = require("../../../config/envConfig");

/**
 * Module dependencies.
 */
const express = require("express");
const multer = require("multer");

const { productController, homeController } = require("../../controllers");
const Authorization = require("../../services/Authorization");
const { productValidation } = require("../../validations");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH_UPLOAD_FILE + "products/");
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
  .route("")
  .get(productController.getProducts)
  .post(upload.array("images"), productController.create);
// .post([Authorization.authorized], productController.create)
// .put([Authorization.authorized, productValidation], productController.update);

router
  .route("/page/:page")
  .get(Authorization.authorized, productController.paginate);

router.route("/cat-products/:name/:page?").get(homeController.catProducts);

// router.route("/search/:keyword/:page?").get(homeController.catProducts);

router
  .route("/:id")
  .get(productController.findById)
  .delete(productController.deleteProduct)
  // .delete(Authorization.authorized, productController.deleteProduct);
  .patch(upload.array("images"), productController.update);

module.exports = router;
