const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/users.js");

router.get("/", user_controller.all);

// get authenticated user
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  user_controller.getAuthenticatedUser
);

// Get a single user using unique email
router.get("/:email", user_controller.getOne);

// Put request to update a single user
router.put("/:email", user_controller.updateOne);

// Delete request to delete a user
router.delete("/:email", user_controller.deleteOne);

// Post request to register a new user
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  user_controller.signup
);

// Post request to login using an existing user
router.post("/login", user_controller.login);

module.exports = router;
