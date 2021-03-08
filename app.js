const express = require("express");
const port = 3000;
const bodyParser = require("body-parser");
const user_router = require("./routes/user");
const product_router = require("./routes/product");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://127.0.0.1:27017/web-scraper", {}, (err) => {
  if (!err) console.log("MongoDB has connected successfully.");
});
mongoose.connection.on("error", (error) => {
  console.log(error);
});
mongoose.Promise = global.Promise;

require("./auth/auth");

const app = express();

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
