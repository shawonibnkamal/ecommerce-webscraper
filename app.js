const express = require("express");
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const user_router = require("./routes/user");
const product_router = require("./routes/product");
const dashboard_router = require("./routes/dashboard");
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

// Methods to use json get, post etc.
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs"); // View template engine for the application
app.set("views", path.join(__dirname, "views")); // Views directory
app.use(express.static("public")); // Directory that serves static files

// Backend routes
app.use("/users", user_router);
app.use("/products", product_router);

// Frontend routes
app.get("/", function (req, res) {
  res.render("./index");
});
app.use("/dashboard", dashboard_router);

server = app.listen(port, () => {
  console.log("Example app listening at http://localhost:%d", port);
});
