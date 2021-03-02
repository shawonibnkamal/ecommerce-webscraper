const User = require("../models/user.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const getOne = async (req, res) => {
  User.findOne({ email: req.params.email }, function (err, user) {
    if (err) {
      res.send("Error occured");
      throw new Error(err);
    }
    res.send(user);
  });
};

const updateOne = async (req, res) => {
  updated_json = {
    $set: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  };
  User.findOneAndUpdate(
    { email: req.params.email },
    updated_json,
    function (err, user) {
      if (err) {
        res.send("Error occured");
        throw new Error(err);
      }
      res.send(user);
    }
  );
};

const deleteOne = async (req, res) => {
  User.remove({ email: req.params.email }, function (err) {
    if (err) {
      res.send({ message: "Error occured" });
      throw new Error(err);
    }

    res.send({ message: "User deleted" });
  });
};

const all = async (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      res.send("Error occured");
      throw new Error(err);
    }
    res.send({ users: users });
  });
};

const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.send({ message: "Invalid credentials" });
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
  getOne,
  updateOne,
  deleteOne,
  all,
  login,
  signup,
};
