const express = require("express");
const { getData, createData } = require("../services/quotes");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await getData(req.query.page));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.json(await createData(req.body));
  } catch (err) {
    console.error(`Error while creating quotes `, err.message);
    next(err);
  }
});

module.exports = router;
