const User = require("../models/user.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const create = async (req, res) => {
  const new_user = new User(req.body.name, req.body.email, req.body.password);
  if (new_user.isValid()) {
    let db = req.db;
    try {
      let msg = await new_user.save(db);
      res.send(msg);
    } catch (err) {
      res.send("There was an error while saving your User. (err:" + err + ")");
      throw new Error(err);
    }
  } else {
    res.send("client-side: The User data you entered is invalid");
  }
};

const getOne = async (req, res) => {
  const user_to_get = req.params.email;
  let db = req.db;
  try {
    let obj = await User.getUserByEmail(db, user_to_get);
    res.send(obj);
  } catch (err) {
    res.send(
      "There was an error while retrieving your User. (err:" + err + ")"
    );
    throw new Error(err);
  }
};

const updateOne = async (req, res) => {
  const user_to_update = req.body;
  const current_email = req.params.email;
  let db = req.db;
  try {
    let msg = await User.update(
      db,
      current_email,
      user_to_update.name,
      user_to_update.email,
      user_to_update.password
    );
    res.send(msg);
  } catch (err) {
    res.send("There was an error while updating your User. (err:" + err + ")");
    throw new Error(err);
  }
};

const deleteOne = async (req, res) => {
  const user_email = req.params.email;
  let db = req.db;
  try {
    let msg = await User.delete(db, user_email);
    res.send(msg);
  } catch (err) {
    res.send("There was an error while deleting your User. (err:" + err + ")");
    throw new Error(err);
  }
};

const all = async (req, res) => {
  let db = req.db;
  try {
    let obj = await User.getUsers(db);
    console.log("server-side: " + obj.length + " user(s) were returned");
    res.send(obj);
  } catch (err) {
    res.send(
      "There was an error while retrieving all Users. (err:" + err + ")"
    );
    throw new Error(err);
  }
};

const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.send({ message: "Invalid credentials" });
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const signup = async (req, res, next) => {
  res.json({
    message: "Signup successful",
    user: req.user,
  });
};

// Make all methods available for use.
module.exports = {
  create,
  getOne,
  updateOne,
  deleteOne,
  all,
  login,
  signup,
};
