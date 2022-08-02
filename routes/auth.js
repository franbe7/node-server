var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../utils/jwt");
const { db } = require("../utils/db");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const jti = uuidv4();
    const { accessToken } = generateToken(user, jti);

    res.json({
      accessToken,
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    next(err);
  }
});

module.exports = router;
