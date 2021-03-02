const express = require("express");
const port = 3000;
const bodyParser = require("body-parser");
const user_router = require("./routes/user");
const product_router = require("./routes/product");
const mongo = require("./utils/db");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://127.0.0.1:27017/web-scraper", {});
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

require("./auth/auth");

// This method runs once and connects to the mongoDB
var db;
async function loadDBClient() {
  try {
    db = await mongo.connectToDB();
  } catch (err) {
    throw new Error("Could not connect to the Mongo DB");
  }
}
loadDBClient();

const app = express();

// This method is executed every time a new request arrives.
// We add the variable db to the request object, to be retrieved in the route req object
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/users", user_router);
app.use("/products", product_router);

server = app.listen(port, () => {
  console.log("Example app listening at http://localhost:%d", port);
});

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  console.log("Closing Mongo Client.");
  mongo.closeDBConnection();
  server.close(() => {
    console.log("Http server closed.");
  });
});
