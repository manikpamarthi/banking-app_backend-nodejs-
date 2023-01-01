require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );

  return token;
};

const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "Not a Valid Token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({ message: "Not a valid token" });
    return;
  }
};

module.exports = { createJWT, protect, comparePasswords, hashPassword };
