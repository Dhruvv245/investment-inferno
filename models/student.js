const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: String,
  email: String,
  password: String,
  amount: Number,
  userStock: {
    stocks: [
      {
        stockid: { type: Schema.Types.ObjectId, ref: "Stock" },
        quantity: { type: Number },
      },
    ],
  },
});

StudentSchema.methods.buyStock = function (stock, quan, amount) {
  console.log("hit");
  const stockIndex = this.userStock.stocks.findIndex((cp) => {
    console.log(cp);
    return cp.stockid.toString() === stock._id.toString();
  });
  console.log(stockIndex);
  let newQuantity = quan;

  const updatedStocks = [...this.userStock.stocks];

  if (stockIndex >= 0) {
    newQuantity = this.userStock.stocks[stockIndex].quantity + parseInt(quan);
    updatedStocks[stockIndex].quantity = newQuantity;
  } else {
    updatedStocks.push({
      stockid: stock._id,
      quantity: newQuantity,
    });
  }
  console.log(updatedStocks);
  const updatedUserStock = {
    stocks: updatedStocks,
  };
  this.amount = amount;
  this.userStock = updatedUserStock;
  return this.save()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

StudentSchema.methods.sellStock = function (stock, quan, amount) {
  const stockIndex = this.userStock.stocks.findIndex((cp) => {
    return cp.stockid.toString() === stock._id.toString();
  });
  let newQuantity = quan;

  const updatedStocks = [...this.userStock.stocks];

  if (stockIndex >= 0) {
    newQuantity = this.userStock.stocks[stockIndex].quantity - quan;
    if (newQuantity <= 0) {
      updatedStocks.splice(stockIndex, stockIndex);
    } else {
      updatedStocks[stockIndex].quantity = newQuantity;
    }
  } else {
    throw "Insufficient stock";
  }
  console.log(updatedStocks);
  const updatedUserStock = {
    stocks: updatedStocks,
  };
  this.amount = amount;
  this.userStock = updatedUserStock;
  return this.save()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoose.model("Student", StudentSchema);
