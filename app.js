if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const mongoose = require("mongoose");
const Stock = require("./models/stock");
const stock = require("./routes/stock");
const login = require("./routes/login");
const userStock = require("./routes/user-stock");
const admin = require("./admin/admin");
const console = require("console");
const MONGODB_URI = process.env.MONGODB_URI;
const cors = require("cors");

const stockPrice = () => {
  const date = new Date();
  const minutes = date.getMinutes();
  var value = "";
  console.log(minutes);
  if (minutes / 2) {
    value = 5;
  } else if (minutes / 3) {
    value = -0.5;
  } else if (minutes / 5) {
    value = 2;
  } else if (minutes / 7) {
    value = -5;
  } else if (minutes / 11) {
    value = 7;
  } else if (minutes / 13) {
    value = -7;
  } else if (minutes / 17) {
    value = 11;
  } else if (minutes / 19) {
    value = -16;
  } else if (minutes / 23) {
    value = 16;
  } else if (minutes / 29) {
    value = 2;
  } else if (minutes / 31) {
    value = -2;
  } else if (minutes / 37) {
    value = 25;
  } else if (minutes / 41) {
    value = -25;
  } else if (minutes / 43) {
    value = 22;
  } else if (minutes / 47) {
    value = -9;
  } else if (minutes / 53) {
    value = -10;
  } else if (minutes / 59) {
    value = 6;
  } else {
    value = 0.7;
  }
  return value;
};

const check = stockPrice();

console.log(check);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/Matcom@Stock123456Admin", admin);
app.get("/login", (req, res) => {
  res.render("login2");
});
app.get("/register", (req, res) => {
  res.render("login");
});

app.get("/stock-api", async (req, res) => {
  await Stock.find({ stockNum: parseInt(req.query.num) })
    .then((result) => {
      const stockPrice = result[0].price + check;
      console.log(stockPrice);
      res
        .status(200)
        .send({ message: "succes", data: result[0], stockPrice: stockPrice });
    })
    .catch((err) => {
      console.log(err);
    });
});
// app.get("/test", stock.makeStock);
app.get("/test", stock.stockDataFront);
app.post("/test", userStock.buy);
app.post("/test2", userStock.sell);
app.get("/getstocks", async (req, res) => {
  await Stock.find()
    .then((result) => {
      console.log(result);
      res.render("stock-view", { data: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post(
  "/login",

  login.UserRegister
);
app.post(
  "/login2",

  login.UserLogin
);

//stocks api

app.all("*", (req, res, next) => {
  next(res.render("test"));
});

mongoose
  .connect(MONGODB_URI)
  .then(async (result) => {
    console.log("Database Connected!!");
    app.listen(port, () => {
      console.log("lets goo");
    });
  })
  .catch((err) => {
    console.log(err);
  });
