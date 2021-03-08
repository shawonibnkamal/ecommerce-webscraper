var assert = require("assert");
const request = require("request");
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
        .then(() => {
          assert.strictEqual(json.productData.title, data.title);
          assert.strictEqual(json.productData.newprice, data.price);
          assert.strictEqual(json.productData.newstock, data.stock);
          assert.strictEqual(json.productData.url, data.url);
          assert.strictEqual(json.productData.sku, data.sku);
        });
    });

    it("Success 3. Delete - Valid product", function () {
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
  });
});
