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

    let title = $("h1").text();
    let price = $(".price-characteristic").attr("content");

    if (!price) {
      let dollars = $(
        "#price > div > span.hide-content.display-inline-block-m > span > span.price-group.price-out-of-stock > span.price-characteristic"
      ).text();
      let cents = $(
        "#price > div > span.hide-content.display-inline-block-m > span > span.price-group.price-out-of-stock > span.price-mantissa"
      ).text();
      price = dollars + "." + cents;
    }

    let seller = "";
    let checkSeller = $(".seller-name");
    if (checkSeller) {
      seller = checkSeller.text();
    }

    let outOfStock = "";
    let checkOutOfStock = $(".prod-ProductOffer-oosMsg");
    if (checkOutOfStock) {
      outOfStock = checkOutOfStock.text();
    }

    let deliveryNotAvaiable = "";
    let checkDeliveryNotAvailable = $(".fulfillment-shipping-text");
    if (checkDeliveryNotAvailable) {
      deliveryNotAvaiable = checkDeliveryNotAvailable.text();
    }

    let stock = "";

    if (
      !seller.includes("Walmart") ||
      outOfStock.includes("Out of Stock") ||
      deliveryNotAvaiable.includes("Delivery not available")
    ) {
      stock = "Out of stock";
    } else {
      stock = "In stock";
    }

    return {
      title,
      price,
      stock,
      url,
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
        price: "$" + result.price,
        stock: result.stock,
        productUrl: result.url,
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
