function emailValidator(email) {
  return email ? /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email) : false;
}

module.exports = { emailValidator };
