var assert = require("assert");
const axios = require("axios");

let complete;
describe("Products app Testing", function () {
  describe("Product", async function () {
    var myurl = "http://localhost:3000";
    it("Success 1. POST - Valid product", function () {
      let data = {
        title: "Sony Noise Cancelling Headphones",
        price: "CDN$ 298.00",
        stock: "In stock",
        url:
          "https://www.amazon.ca/Sony-WH1000XM3-Canceling-Headphones-WH-1000XM3/dp/B07G4MNFS1/ref=sr_1_8?dchild=1&keywords=headphones&qid=1615235484&s=electronics&sr=1-8",
        sku: "12345678",
      };
      complete = axios
        .post(myurl + "/products/new", data, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          assert.strictEqual(
            response.data.message,
            "Product added successfully in the database."
          );
        });
    });

    it("Failure 1. POST - Duplicate product", function () {
      let data = {
        title: "Sony Noise Cancelling Headphones",
        price: "CDN$ 298.00",
        stock: "In stock",
        url:
          "https://www.amazon.ca/Sony-WH1000XM3-Canceling-Headphones-WH-1000XM3/dp/B07G4MNFS1/ref=sr_1_8?dchild=1&keywords=headphones&qid=1615235484&s=electronics&sr=1-8",
        sku: "12345678",
      };
      if (complete) {
        axios
          .post(myurl + "/products/new", data, {
            headers: { "content-type": "application/json" },
          })
          .then((response) => {
            assert.strictEqual(
              response.data.message,
              "Product already exist in the database."
            );
          });
      }
    });

    it("Success 2. Get - Valid product", function () {
      let data = {
        title: "Sony Noise Cancelling Headphones",
        price: "CDN$ 298.00",
        stock: "In stock",
        url:
          "https://www.amazon.ca/Sony-WH1000XM3-Canceling-Headphones-WH-1000XM3/dp/B07G4MNFS1/ref=sr_1_8?dchild=1&keywords=headphones&qid=1615235484&s=electronics&sr=1-8",
        sku: "12345678",
      };
      axios
        .get(myurl + "/products/search?sku=" + data.sku, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          assert.strictEqual(response.data.title, data.title);
          assert.strictEqual(response.data.newprice, data.price);
          assert.strictEqual(response.data.newstock, data.stock);
          assert.strictEqual(response.data.url, data.url);
          assert.strictEqual(response.data.sku, data.sku);
        });
    });

    it("Failure 2. Get - Invalid product", function () {
      let data = {
        title: "Sony Noise Cancelling Headphones",
        price: "CDN$ 298.00",
        stock: "In stock",
        url:
          "https://www.amazon.ca/Sony-WH1000XM3-Canceling-Headphones-WH-1000XM3/dp/B07G4MNFS1/ref=sr_1_8?dchild=1&keywords=headphones&qid=1615235484&s=electronics&sr=1-8",
        sku: "12345678",
      };
      axios
        .get(myurl + "/products/search?sku=" + data.sku + 52, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          assert.strictEqual(response.data.message, "Product not found!");
        });
    });

    it("Success 3. POST - Update all product", function () {
      axios
        .post(
          myurl + "/products/update",
          {},
          {
            headers: { "content-type": "application/json" },
          }
        )
        .then((response) => {
          assert.strictEqual(response.data.message, "Products are updating.");
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Success 4. Delete - Valid product", function () {
      if (complete) {
        axios
          .delete(myurl + "/products/delete/12345678", {
            headers: { "content-type": "application/json" },
          })
          .then((response) => {
            assert.strictEqual(
              response.data.message,
              "Product deleted successfully."
            );
          });
      }
    });

    it("Failure 4. Delete - Invalid product", function () {
      if (complete) {
        axios
          .delete(myurl + "/products/delete/", {
            headers: { "content-type": "application/json" },
          })
          .then((response) => {
            assert.strictEqual(response.data.message, "Error deleting product");
          });
      }
    });
  });
});
