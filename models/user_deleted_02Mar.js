const Validator = require("validatorjs");
const ObjectId = require("mongodb").ObjectID;

async function _get_users_collection(db) {
  try {
    return await db.collection("users");
  } catch (err) {
    throw err;
  }
}

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  isValid() {
    const rules = {
      name: "required|string",
      email: "required|string",
      password: "required|string",
    };
    const validation = new Validator(this, rules);
    return validation.passes();
  }

  async save(db) {
    var user = this;
    return new Promise(async function (resolve, reject) {
      if (user.isValid()) {
        let collection = await _get_users_collection(db);
        collection.insertOne(user, (err, obj) => {
          if (err) {
            reject("User cannot be registered!");
          } else {
            resolve("User created!");
          }
        });
      } else {
        reject("User data invalid!");
      }
    });
  }

  static async update(db, current_email, name, email, password) {
    return new Promise(async function (resolve, reject) {
      var new_user = new User(name, email, password);
      if (new_user.isValid()) {
        let collection = await _get_users_collection(db);
        let new_vals = {
          $set: {
            name: name,
            email: email,
            password: password,
          },
        };
        collection.updateOne({ email: current_email }, new_vals, (err, obj) => {
          if (err) {
            reject("User could not be updated.");
          } else {
            console.log(obj);
            if (obj.modifiedCount > 0) {
              resolve("User correctly updated in the database.");
            } else {
              reject("User could not be updated.");
            }
          }
        });
      } else {
        reject("Data invalid");
      }
    });
  }

  static async delete(db, email) {
    return new Promise(async function (resolve, reject) {
      let collection = await _get_users_collection(db);
      collection.deleteMany({ email: email }, (err, obj) => {
        if (err) {
          reject("User could not be deleted.");
        } else {
          if (obj.result.n > 0) {
            resolve("User correctly deleted in the database.");
          } else {
            reject("User could not be deleted.");
          }
        }
      });
    });
  }

  static async getUserByEmail(db, email) {
    return new Promise(async function (resolve, reject) {
      let collection = await _get_users_collection(db);
      collection.find({ email: email }).toArray((err, items) => {
        if (err) {
          reject("User could not be retrieved.");
        } else {
          if (items.length > 0) {
            resolve(items);
          } else {
            reject("User was not found.");
          }
        }
      });
    });
  }

  static async getUsers(db) {
    return new Promise(async function (resolve, reject) {
      let collection = await _get_users_collection(db);

      collection.find({}).toArray((err, items) => {
        if (err) {
          reject("Users could not be retrieved.");
        } else {
          if (items.length > 0) {
            resolve(items);
          } else {
            reject("Database empty.");
          }
        }
      });
    });
  }

  static async login(db, email, password) {
    return new Promise(async function (resolve, reject) {
      let collection = await _get_users_collection(db);

      resolve(email);
    });
  }
}

module.exports = User;
