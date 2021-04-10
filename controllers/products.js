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

    // Check which website is added to the url
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
      } else {
        price = "";
      }

      if (price == undefined || price == "") {
        price = $("#priceblock_ourprice");
        if (price) {
          price = price.text();
        } else {
          price = "";
        }
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

// Search a product using SKU
const search = (req, res) => {
  let userSku = req.query.sku;
  if (userSku) {
    Product.findOne({ sku: userSku })
      .then((product) => {
        if (!product) {
          res.status(400).send({ message: "Product not found!" });
        }

        res.send({ products: [product] });
      })
      .catch((err) => {
        res.send({ message: "There was an error" });
      });
  } else {
    res.send({ products: {} });
  }
};

// Get products that are in stock
const getInStock = (req, res) => {
  Product.find({ newstock: "In stock" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error" });
    });
};

// Get products that are out of stock
const getOutOfStock = (req, res) => {
  Product.find({ newstock: "Out of stock" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error" + err });
    });
};

// Get products that had a price change since last time
const getPriceChanged = (req, res) => {
  Product.find({})
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

// Get products that came back in stock
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

// Get all products
const getAll = (req, res) => {
  Product.find()
    .then((products) => {
      // count variables
      let total = 0;
      let instock = 0;
      let outofstock = 0;
      let pricechanged = 0;
      let backinstock = 0;
      let updated = 0;
      let notupdated = 0;

      products.forEach((product) => {
        total++;
        if (product.newstock === "In stock") {
          instock++;
        }
        if (product.newstock === "Out of stock") {
          outofstock++;
        }
        if (product.newprice !== product.oldprice) {
          pricechanged++;
        }
        if (
          product.oldstock === "Out of stock" &&
          product.newstock === "In stock"
        ) {
          backinstock++;
        }
        if (product.updatestatus === "Updated") {
          updated++;
        }
        if (product.updatestatus === "Not Updated") {
          notupdated++;
        }
      });

      res.send({
        products: products,
        counts: {
          total: total,
          instock: instock,
          outofstock: outofstock,
          pricechanged: pricechanged,
          backinstock: backinstock,
          updated: updated,
          notupdated: notupdated,
        },
      });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

// Get products that got updated
const getUpdated = (req, res) => {
  Product.find({ updatestatus: "Updated" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

// Get products that are not updated
const getNotUpdated = (req, res) => {
  Product.find({ updatestatus: "Not Updated" })
    .then((products) => {
      res.send({ products: products });
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

// Get request to Scrape Data from url
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

// Add a new product
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
      } else {
        Product.create(newProduct).then((product) => {
          res.send({ message: "Product added successfully in the database." });
        });
      }
    })
    .catch((err) => {
      res.send({ message: "There was an error " + err });
    });
};

// Update all products
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

// Delete a product
const deleteProduct = (req, res) => {
  let searchQuery = { sku: req.params.sku };

  if (req.params.sku == undefined) {
    res.send({ message: "Error deleting product" });
    return;
  }

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
  getAll,
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
