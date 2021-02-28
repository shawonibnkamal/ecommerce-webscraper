const Product = require("../models/product.js");

const create = async (req, res) => {
  const new_product = new Product(
    parseInt(req.body.id),
    req.body.name,
    req.body.authors,
    parseInt(req.body.year),
    req.body.publisher
  );
  if (new_product.isValid()) {
    let db = req.db;
    try {
      let msg = await new_product.save(db);
      res.send(msg);
    } catch (err) {
      res.send(
        "There was an error while saving your Product. (err:" + err + ")"
      );
      throw new Error(err);
    }
  } else {
    res.send("client-side: The Product data you entered is invalid");
  }
};

const getOne = async (req, res) => {
  const product_to_get = req.params.id;
  let db = req.db;
  try {
    let obj = await Product.getProductById(db, product_to_get);
    res.send(obj);
  } catch (err) {
    res.send(
      "There was an error while retrieving your Product. (err:" + err + ")"
    );
    throw new Error(err);
  }
};

const updateOne = async (req, res) => {
  const product_to_update = req.body;
  const product_id = req.params.id;
  let db = req.db;
  try {
    let msg = await Product.update(
      db,
      product_id,
      product_to_update.name,
      product_to_update.authors,
      product_to_update.year,
      product_to_update.publisher
    );
    res.send(msg);
  } catch (err) {
    res.send(
      "There was an error while updating your Product. (err:" + err + ")"
    );
    throw new Error(err);
  }
};

const deleteOne = async (req, res) => {
  const product_id = req.params.id;
  let db = req.db;
  try {
    let msg = await Product.delete(db, product_id);
    res.send(msg);
  } catch (err) {
    res.send(
      "There was an error while deleting your Product. (err:" + err + ")"
    );
    throw new Error(err);
  }
};

const all = async (req, res) => {
  let db = req.db;
  try {
    let obj = await Product.getProducts(db);
    console.log("server-side: " + obj.length + " product(s) were returned");
    res.send(obj);
  } catch (err) {
    res.send(
      "There was an error while retrieving all Products. (err:" + err + ")"
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
