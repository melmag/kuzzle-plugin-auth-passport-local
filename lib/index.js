var
  hooks = require('./config/hooks'),
  PasswordManager = require('./passwordManager'),
  Strategy = require('./passport/strategy'),
  q = require('q');

module.exports = function () {
  this.isDummy = false;
  this.context = {};

  this.init = function (config, context, isDummy) {
    if (!config) {
      console.error(new Error('plugin-auth-passport-local: A configuration is required for plugin kuzzle-plugin-auth-passport-local'));
      return false;
    }
    if (!config.secret) {
      console.error(new Error('plugin-auth-passport-local: The \'secret\' attribute is required'));
      return false;
    }
    if (!config.algorithm) {
      console.error(new Error('plugin-auth-passport-local: The \'algorithm\' attribute is required'));
      return false;
    }
    if (!config.digest) {
      console.error(new Error('plugin-auth-passport-local: The \'digest\' attribute is required'));
      return false;
    }

    this.isDummy = isDummy;
    this.context = context;

    this.context.passwordManager = new PasswordManager(config);

    return this;
  };

  this.hooks = hooks;

  this.loadStrategy = function (passport) {
    var strategy = new Strategy(this.context);
    strategy.load(passport);
  };

  this.encryptCredentials = function(requestObject) {
    if (requestObject.data.password === undefined) {
      return q.reject(new this.context.BadRequestError('Invalid user object. No password property found.'))
    }

    return this.context.passwordManager.encryptPassword(requestObject.data.password)
      .then(encryptedPassword => {
        requestObject.data.password = encryptedPassword;

        return requestObject;
      })
  };
};
