const express = require("express");
const router = express.Router();
const Stock = require("../models/stock");
const Student = require("../models/student");
const Admin = require("../models/admin");

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
        res.status(201).send({ message: err });
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
        res.status(201).send({ message: err });
      });
  });

router
  .route("/test4")
  .get(async (req, res, next) => {
    console.log(req.body);

    res.render("createMessage");
  })
  .post(async (req, res, next) => {
    console.log(req.body);
    const stockNum = req.body.stockNum;
    const filter = { stockNum: stockNum };
    const update = { message: req.body.message };
    await Stock.findOneAndUpdate(filter, update, {
      new: true,
    })
      .then((result) => {
        res.redirect("/Matcom@Stock123456Admin/test");
      })
      .catch((err) => {
        res.status(201).send({ message: err });
      });
  });

router.route("/test5").get(async (req, res) => {
  await Admin.findOneAndUpdate(
    { _id: "6431cd246b8a210baa7d1fe0" },
    { leader: false },
    {
      new: true,
      upsert: true, // Make this update into an upsert
    }
  )
    .then((result) => {
      console.log(result);
      res.redirect("/Matcom@Stock123456Admin/test");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/test6").get(async (req, res) => {
  await Admin.findOneAndUpdate(
    { _id: "6431cd246b8a210baa7d1fe0" },
    { leader: true },
    {
      new: true,
      upsert: true, // Make this update into an upsert
    }
  )
    .then((result) => {
      console.log(result);
      res.redirect("/Matcom@Stock123456Admin/test");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
