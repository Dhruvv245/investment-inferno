const Stock = require("../models/stock");

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
