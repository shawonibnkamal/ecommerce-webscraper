const express = require("express");
const router = express.Router();

//GET routes starts here
router.get("/", function (req, res) {
  res.render("./dashboard");
});

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

module.exports = router;
