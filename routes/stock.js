const Stock = require("../models/stock");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
const moment = require("moment");
const date = moment();

const Student = require("../models/student");

module.exports.makeStock = async (req, res, next) => {
  await new Stock({
    stockNum: 1,
    name: "test1",
    price: 100,
    description: "ambani",
  })
    .save()
    .then((res) => {
      console.log(res);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

//api-for getting stocks

module.exports.stockData = async (req, res, next, check) => {
  let value1 = Math.random() * 22;
  let plusOrMinus = Math.round(Math.random()) * 2 - 1;

  await Stock.find({ stockNum: parseInt(req.query.num) })
    .then((result) => {
      const stockPrice = result[0].price + plusOrMinus * 0.5 * value1;
      console.log(stockPrice);
      res
        .status(200)
        .send({ message: "succes", data: result[0], stockPrice: stockPrice });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.stockDataFront = async (req, res, next) => {
  const user = req.session.StudentId;
  if (user) {
    const currentDate = date.format("dddd, MMMM Do YYYY");
    const data = await Stock.find();

    res.render("stock-view", { data: data, date: currentDate });
  } else {
    res.redirect("login");
  }
};

module.exports.profile = async (req, res) => {
  const user = req.session.StudentId;

  const student = await Student.findById(user);

  if (student) {
    const stocks = student.userStock.stocks.length;
    const stock = student.userStock.stocks;

    // let newStocks = new Array();

    // stock.map(async (stock, index) => {
    //   let data = await Stock.findById(stock.stockid);
    // });

    pl = Math.sqrt((student.amount - 10000) * (student.amount - 10000)) / 100;
    res.render("profile", {
      data: student,
      pl: pl,
      stocks: stocks,
      datas: stock,
    });
  } else {
    res.redirect("login");
  }
};

module.exports.stockSingle = async (req, res, next) => {
  const user = req.session.StudentId;
  if (user) {
    const currentDate = date.format("dddd, MMMM Do YYYY");

    const stock = await Stock.find({ stockNum: req.params.stockid });

    res.render("individual-stock", { date: currentDate, data: stock[0] });
  } else {
    res.redirect("/login");
  }
};

module.exports.leader = async (req, res, next) => {
  const user = req.session.StudentId;
  if (user) {
    res.render("leader");
  } else {
    res.redirect("/login");
  }
};
