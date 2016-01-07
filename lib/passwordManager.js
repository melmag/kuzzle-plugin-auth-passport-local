var
  PasswordManager,
  q = require('q'),
  crypto = require('crypto');

module.exports = function(config) {
  this.encryptPassword = function (password) {
    var hashedPassword = crypto.createHmac(config.algorithm, config.secret).update(password).digest(config.digest);
    return q(hashedPassword);
  },

  this.checkPassword = function (password, hash) {
    return this.encryptPassword(password)
      .then(function (value) {
        return q(hash === value);
      });
  }
};
