const Validator = require("validatorjs");

async function _get_products_collection(db) {
  try {
    return await db.collection("products");
  } catch (err) {
    throw err;
  }
}

class Product {
  constructor(id, name, url, price, in_stock) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.price = price;
    this.in_stock = in_stock;
  }

  isValid() {
    const rules = {
      id: "required|integer",
      name: "required|string",
      url: "required|string",
      price: "required|integer",
      in_stock: "required|string",
    };
    const validation = new Validator(this, rules);
    return validation.passes();
  }

  async save(db) {
    var product = this;
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }

  static async update(db, id, name, authors, year, publisher) {
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }

  static async delete(db, id) {
    var id_delete = id;
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }

  static async getProductById(db, id) {
    var id_get = id;
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }

  static async getProducts(db) {
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }
}

module.exports = Product;
