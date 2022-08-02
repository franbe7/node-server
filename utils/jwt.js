const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
  });
}

function generateToken(user) {
  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
}

module.exports = {
  generateAccessToken,
  generateToken,
};
