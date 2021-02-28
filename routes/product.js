const express = require("express");
const router = express.Router();

const product_controller = require("../controllers/products.js");

router.post("/", product_controller.create);
router.get("/", product_controller.all);
router.get("/:id", product_controller.getOne);
router.put("/:id", product_controller.updateOne);
router.delete("/:id", product_controller.deleteOne);

module.exports = router;
