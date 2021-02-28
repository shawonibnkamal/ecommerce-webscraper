const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/users.js");

router.post("/", user_controller.create);
router.get("/", user_controller.all);
router.get("/:id", user_controller.getOne);
router.put("/:id", user_controller.updateOne);
router.delete("/:id", user_controller.deleteOne);

module.exports = router;
