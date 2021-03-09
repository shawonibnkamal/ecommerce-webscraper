const express = require("express");
const router = express.Router();

const product_controller = require("../controllers/products");

//requiring product model
const product = require("../models/product");

//GET routes starts here
router.get("/search", product_controller.search);

router.get("/instock", product_controller.getInStock);

router.get("/outofstock", product_controller.getOutOfStock);

router.get("/pricechanged", product_controller.getPriceChanged);

router.get("/backinstock", product_controller.getBackInStock);

router.get("/updated", product_controller.getUpdated);

router.get("/notupdated", product_controller.getNotUpdated);

router.get("/fetch", product_controller.fetchData);

//POST routes starts here
router.post("/new", product_controller.postNewProduct);

router.post("/update", product_controller.postUpdateProduct);

//DELETE routes starts here
router.delete("/delete/:sku", product_controller.deleteProduct);

module.exports = router;
