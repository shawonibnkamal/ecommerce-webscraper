const User = require("../models/user.js");

const create = async (req, res) => {
  const new_user = new User(
    parseInt(req.body.id),
    req.body.name,
    req.body.authors,
    parseInt(req.body.year),
    req.body.publisher
  );
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
  const user_to_get = req.params.id;
  let db = req.db;
  try {
    let obj = await User.getUserById(db, user_to_get);
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
  const user_id = req.params.id;
  let db = req.db;
  try {
    let msg = await User.update(
      db,
      user_id,
      user_to_update.name,
      user_to_update.authors,
      user_to_update.year,
      user_to_update.publisher
    );
    res.send(msg);
  } catch (err) {
    res.send("There was an error while updating your User. (err:" + err + ")");
    throw new Error(err);
  }
};

const deleteOne = async (req, res) => {
  const user_id = req.params.id;
  let db = req.db;
  try {
    let msg = await User.delete(db, user_id);
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

// Make all methods available for use.
module.exports = {
  create,
  getOne,
  updateOne,
  deleteOne,
  all,
};
