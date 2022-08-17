var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { db } = require('../utils/db');
const { emailValidator } = require('../utils/validators');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('You must provide an email and a password.');
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }

    const { accessToken } = generateToken(user);

    res.json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!emailValidator(email)) {
      res.status(400);
      throw new Error('You must provide an valid email.');
    }

    if (!email || !password) {
      res.status(400);
      throw new Error('You must provide an email and a password.');
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400);
      throw new Error('Email already in use.');
    }

    const hashedPass = bcrypt.hashSync(password, 12);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPass,
      },
    });

    const { accessToken } = generateToken(user);

    res.json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
