const express = require("express");
const { deactiveUser } = require("../services/deactiveUser");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const result = await deactiveUser(req.body);
    res.json(result);
  } catch (err) {
    console.error(`Error while deactiavting user `, err.message);
    next(err);
  }
});

module.exports = router;
