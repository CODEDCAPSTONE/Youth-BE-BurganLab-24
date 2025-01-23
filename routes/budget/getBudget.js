const express = require("express");

const Budget = require("../../model/budget");
const Transaction = require("../../model/transaction");
const { requireAuth } = require("../../middleware");
const router = express.Router();

// GET route to fetch all budgets
router.get("/", requireAuth, async (req, res) => {
  try {
    let budgets = await Budget.find();

    // Adding the list of categories
    const categoriesEnum = [
      "Online shopping",
      "Restaurant",
      "Fuel",
      "Entertainment",
      // "Other",
    ];
    let totalList = [];
    for (let category of categoriesEnum) {
      const list = await Transaction.find({ category });
      function myFunction2(total, item, index, array) {
        return total + item["amount"];
      }
      let limit = budgets.find((item, index, array) => item["category"] == category).limit;
      // console.log(limit);
      totalList.push({category, total: list.reduce(myFunction2, 0), limit});
    }

    // function myFunction(item, index, array) {
    //   return item.category == 'Online shopping';
    // }
    // function myFunction2(total, item, index, array) {
    //   return total + item.amount;
    // }
    // console.log(list.filter(myFunction));
    // console.log(list.filter(myFunction).reduce(myFunction2, 0));

    res.status(200).json({
      // budgets,
      totalList,
      // categories: categoriesEnum,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});
module.exports = { budgetGetRouter: router };
