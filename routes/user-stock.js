const Student = require("../models/student");
const Stock = require("../models/stock");

module.exports.buy = async (req, res, next) => {
  const stockNum = req.body.stockNum;
  const email = req.body.email;
  const quantity = req.body.quantity;

  await Student.findOne({ email: email })
    .then(async (result) => {
      const stock = await Stock.findOne({ stockNum: stockNum });

      if (result.amount > quantity * stock.price) {
        const amount = result.amount - quantity * stock.price;
        data = await result.buyStock(stock, quantity, amount);
        res.status(201).send({ mesaage: "Successful Transaction", data: data });
      } else {
        res.status(401).send({ mesaage: "Insufficient funds", data: result });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.sell = async (req, res, next) => {
  const stockNum = req.body.stockNum;
  const email = req.body.email;
  const quantity = req.body.quantity;

  await Student.findOne({ email: email })
    .then(async (result) => {
      const stock = await Stock.findOne({ stockNum: stockNum });
      console.log(result);

      const amount = result.amount + quantity * stock.price;
      data = await result.sellStock(stock, quantity, amount);
      res.status(201).send({ mesaage: "Successful Transaction", data: data });
    })
    .catch((err) => {
      console.log(err);
    });
};
