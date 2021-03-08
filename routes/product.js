const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");

const product_controller = require("../controllers/products");

//requiring product model
const product = require("../models/product");

// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
  return next();
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  //   req.flash("error_msg", "Please Login first to access this page.");
  //   res.redirect("/login");
}

let browser;

//GET routes starts here
router.get("/search", isAuthenticatedUser, product_controller.search);

router.get("/instock", isAuthenticatedUser, product_controller.getInStock);

router.get(
  "/outofstock",
  isAuthenticatedUser,
  product_controller.getOutOfStock
);

router.get(
  "/pricechanged",
  isAuthenticatedUser,
  product_controller.getPriceChanged
);

router.get(
  "/backinstock",
  isAuthenticatedUser,
  product_controller.getBackInStock
);

router.get("/updated", isAuthenticatedUser, product_controller.getUpdated);

router.get(
  "/notupdated",
  isAuthenticatedUser,
  product_controller.getNotUpdated
);

router.get("/fetch", isAuthenticatedUser, product_controller.fetchData);

//POST routes starts here
router.post("/new", isAuthenticatedUser, product_controller.postNewProduct);

router.post(
  "/update",
  isAuthenticatedUser,
  product_controller.postUpdateProduct
);

//DELETE routes starts here
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  product_controller.deleteProduct
);

module.exports = router;
