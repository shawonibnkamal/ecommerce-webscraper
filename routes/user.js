const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/users.js");

router.get("/", user_controller.all);
router.get("/:email", user_controller.getOne);
router.put("/:email", user_controller.updateOne);
router.delete("/:email", user_controller.deleteOne);
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  user_controller.signup
);
router.post("/login", user_controller.login);

module.exports = router;
