const Validator = require("validatorjs");

async function _get_users_collection(db) {
  try {
    return await db.collection("users");
  } catch (err) {
    throw err;
  }
}

class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  isValid() {
    const rules = {
      name: "required|string",
      password: "required|string",
    };
    const validation = new Validator(this, rules);
    return validation.passes();
  }

  async save(db) {
    var user = this;
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

  static async getUserById(db, id) {
    var id_get = id;
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }

  static async getUsers(db) {
    return new Promise(async function (resolve, reject) {
      /**
       * Write your code here
       */
    });
  }
}

module.exports = User;
