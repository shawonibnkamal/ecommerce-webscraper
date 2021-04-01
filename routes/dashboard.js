const express = require("express");
const router = express.Router();

// Dashboard Homepage
router.get("/", function (req, res) {
  res.render("./dashboard");
});

// Routes for products
router.get("/products", function (req, res) {
  res.render("./products/all");
});

router.get("/products/instock", function (req, res) {
  res.render("./products/instock");
});

router.get("/products/outofstock", function (req, res) {
  res.render("./products/outofstock");
});

router.get("/products/pricechanged", function (req, res) {
  res.render("./products/pricechanged");
});

router.get("/products/backinstock", function (req, res) {
  res.render("./products/backinstock");
});

router.get("/products/updated", function (req, res) {
  res.render("./products/updated");
});

router.get("/products/notupdated", function (req, res) {
  res.render("./products/notupdated");
});

// route to add new product
router.get("/products/add", function (req, res) {
  res.render("./products/add");
});

// Routes for users
router.get("/users/", function (req, res) {
  res.render("./users/all");
});

router.get("/users/add", function (req, res) {
  res.render("./users/add");
});

router.get("/users/edit", function (req, res) {
  res.render("./users/edit");
});

module.exports = router;
