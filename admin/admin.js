const express = require("express");
const router = express.Router();
const Stock = require("../models/stock");

router.route("/test").get((req, res) => {
  res.render("admin");
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

module.exports = router;
