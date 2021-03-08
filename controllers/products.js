const express = require("express");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

//requiring product model
let Product = require("../models/product");

//Scrape Function
async function scrapeData(url, page) {
  try {
    await page.goto(url, { waitUntil: "load", timeout: 0 });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);

    let website;

    if (url.includes("bestbuy.ca")) {
      website = "bestbuy";
    } else if (url.includes("amazon.ca")) {
      website = "amazon";
    } else {
      website = undefined;
    }

    // get title of product
    let title = $("h1");
    if (title) {
      title = title.text().replace(/\n/g, "");
    } else {
      title = "";
    }

    // get price of product
    let price = "";
    if (website == "bestbuy") {
      price = $(".price_FHDfG");
      if (price) {
        price = price.text();
        price = price.substr(0, price.length - 2) + "." + price.substr(-2);
      } else {
        price = "";
      }
    } else if (website == "amazon") {
      price = $("#price_inside_buybox");
      if (price) {
        price = price.text().replace(/\n/g, "");
      }
    }

    // get inventory status
    let stock = "";
    if (website == "bestbuy") {
      let checkStock = $(".addToCartButton");
      if (checkStock) {
        checkStock = checkStock.attr("disabled");

        if (checkStock == null) {
          stock = "In stock";
        } else {
          stock = "Out of stock";
        }
      }
    } else if (website == "amazon") {
      let checkStock = $("#outOfStock");
      if (checkStock) {
        if (checkStock.text().includes("Currently unavailable")) {
          stock = "Out of stock";
        } else {
          stock = "In stock";
        }
      } else {
        stock = "In stock";
      }
    }

    // get sku
    let sku = $(".modelInformation_1ZG9l:nth-child(2)");
    if (sku) {
      sku = sku.text().replace("Web Code: ", "");
    } else {
      sku = "";
    }

    return {
      title,
      price,
      stock,
      url,
      sku,
    };
  } catch (error) {
    console.log(error);
  }
}

const search = (req, res) => {
  let userSku = req.query.sku;
  if (userSku) {
    Product.findOne({ sku: userSku })
      .then((product) => {
        if (!product) {
          res.send("Product not found!");
        }

        res.send({ productData: product });
      })
      .catch((err) => {
        res.send({ message: "There was an error" });
      });
  } else {
    res.send({ productData: {} });
  }
};

const getInStock = (req, res) => {
  Product.find({ newstock: "In stock" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error" });
    });
};

const getOutOfStock = (req, res) => {
  Product.find({ newstock: "Out of stock" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error" + err });
    });
};

const getPriceChanged = (req, res) => {
  Product.find({})
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

const getBackInStock = (req, res) => {
  Product.find({
    $and: [{ oldstock: "Out of stock" }, { newstock: "In stock" }],
  })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

const getUpdated = (req, res) => {
  Product.find({ updatestatus: "Updated" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

const getNotUpdated = (req, res) => {
  Product.find({ updatestatus: "Not Updated" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

const fetchData = async (req, res) => {
  try {
    let url = req.query.search;
    if (url) {
      browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      let result = await scrapeData(url, page);

      let productData = {
        title: result.title,
        price: result.price,
        stock: result.stock,
        productUrl: result.url,
        sku: result.sku,
      };
      res.send({ productData: productData });
      browser.close();
    } else {
      let productData = {
        title: "",
        price: "",
        stock: "",
        productUrl: "",
      };
      res.send({ productData: productData });
    }
  } catch (error) {
    res.send({ message: "There was an error " + error });
  }
};

// Post request

const postNewProduct = (req, res) => {
  let { title, price, stock, url, sku } = req.body;

  let newProduct = {
    title: title,
    newprice: price,
    oldprice: price,
    newstock: stock,
    oldstock: stock,
    sku: sku,
    company: "Walmart",
    url: url,
    updatestatus: "Updated",
  };

  Product.findOne({ sku: sku })
    .then((product) => {
      if (product) {
        res.send({ message: "Product already exist in the database." });
      }

      Product.create(newProduct).then((product) => {
        res.send({ message: "Product added successfully in the database." });
      });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

const postUpdateProduct = async (req, res) => {
  try {
    res.send({ message: "Products are updating." });

    Product.find({})
      .then(async (products) => {
        for (let i = 0; i < products.length; i++) {
          Product.updateOne(
            { url: products[i].url },
            {
              $set: {
                oldprice: products[i].newprice,
                oldstock: products[i].newstock,
                updatestatus: "Not Updated",
              },
            }
          ).then((products) => {});
        }

        browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();

        for (let i = 0; i < products.length; i++) {
          let result = await scrapeData(products[i].url, page);
          Product.updateOne(
            { url: products[i].url },
            {
              $set: {
                title: result.title,
                newprice: "$" + result.price,
                newstock: result.stock,
                updatestatus: "Updated",
              },
            }
          ).then((products) => {});
        }
      })
      .catch((err) => {
        res.send({ message: "There was an error " + err });
      });
  } catch (error) {
    res.send({ message: "There was an error " + err });
  }
};

const deleteProduct = (req, res) => {
  let searchQuery = { _id: req.params.id };

  Product.deleteOne(searchQuery)
    .then((product) => {
      res.send({ message: "Product deleted successfully." });
    })
    .catch((err) => {
      req.send({ message: "There was an error " + err });
    });
};

module.exports = {
  search,
  getInStock,
  getOutOfStock,
  getPriceChanged,
  getBackInStock,
  getUpdated,
  getNotUpdated,
  postNewProduct,
  postUpdateProduct,
  deleteProduct,
  fetchData,
};
