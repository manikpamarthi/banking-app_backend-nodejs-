const express = require("express");
const { loginUser, getUserData } = require("../services/login");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await getUserData(req.query.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    if (!result) {
      res.json({ message: "user not found" }, 400);
    }
    res.json(result);
  } catch (err) {
    console.error(`Error while logging user `, err.message);
    next(err);
  }
});

module.exports = router;
