const Student = require("../models/student");
const Stock = require("../models/stock");

module.exports.buy = async (req, res, next) => {
  const stockNum = req.params.stockNum;
  console.log(stockNum);
  const user = req.session.StudentId;
  // const email = req.body.email;
  const quantity = req.body.quantity;
  if (user) {
    await Student.findById(user)
      .then(async (result) => {
        console.log(result);
        const stock = await Stock.find({ stockNum: req.params.stockid });
        console.log(stock);
        if (result.amount > quantity * stock[0].price) {
          const amount = result.amount - quantity * stock[0].price;
          data = await result.buyStock(stock[0], quantity, amount);
          res.redirect("/profile");
        } else {
          res.status(401).send({ mesaage: "Insufficient funds", data: result });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
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
