var assert = require("assert");
const request = require("request");

describe("Products app Testing", function () {
  describe("New product", async function () {
    var myurl = "http://localhost:3000";
    it("Success 1. POST - Valid product", function () {
      let data = {
        title: "Sony Noise Cancelling Headphones",
        price: "CDN$ 298.00",
        stock: "In stock",
        url:
          "https://www.amazon.ca/Sony-WH1000XM3-Canceling-Headphones-WH-1000XM3/dp/B07G4MNFS1/ref=sr_1_8?dchild=1&keywords=headphones&qid=1615235484&s=electronics&sr=1-8",
      };
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: myurl + "/products/new",
          body: JSON.stringify(data),
        },
        function (error, response, body) {
          let json = JSON.parse(body);
          assert.strictEqual(
            json.message,
            "Product added successfully in the database."
          );
        }
      );
    });
  });
});
