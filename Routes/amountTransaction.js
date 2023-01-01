const express = require("express");
const {
  doTransaction,
  getTransactions,
} = require("../services/amountTransaction");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await getTransactions(req.query));
  } catch (e) {
    console.log("Error while getting transactions", e);
    next();
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.json(await doTransaction(req.body));
  } catch (e) {
    console.log("Error while creating transaction", e);
    next();
  }
});

module.exports = router;
