const express = require("express");
const router = express.Router();
const Stock = require("../models/stock");
const Student = require("../models/student");

router.route("/test").get(async (req, res) => {
  const stocks = await Stock.find();
  const students = await Student.find();
  console.log(stocks, students);
  res.render("admin", { stocks: stocks, students: students });
});

router
  .route("/test2")
  .get((req, res) => {
    res.render("adminStockMake");
  })
  .post(async (req, res, next) => {
    const { name, stockNum, price, description } = req.body;
    console.log(req.body, name, stockNum, price, description);
    await new Stock({
      stockNum: stockNum,
      name: name,
      price: parseFloat(price),
      description: description,
    })
      .save()
      .then((result) => {
        res.redirect("/Matcom@Stock123456Admin/test2");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/Matcom@Stock123456Admin/test2");
      });
  });

router
  .route("/test3")
  .get(async (req, res) => {
    const stocks = await Stock.find();
    res.render("editStock", { stocks: stocks });
  })
  .post(async (req, res, next) => {
    console.log(req.body);
    await Stock.findOneAndUpdate(
      { stockNum: req.body.stockNum },
      { price: req.body.price }
    )
      .then((result) => {
        res.redirect("/Matcom@Stock123456Admin/test");
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = router;
