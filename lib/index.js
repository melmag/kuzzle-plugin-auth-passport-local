var
  hooks = require('./config/hooks'),
  pipes = require('./config/pipes'),
  PasswordManager = require('./passwordManager'),
  Strategy = require('./passport/strategy');

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

  this.pipes = pipes;
  this.hooks = hooks;

  this.loadStrategy = function (passport) {
    var strategy = new Strategy(this.context);
    strategy.load(passport);
  };

  this.encryptCredentials = function(requestObject, callback) {
    if (requestObject.data.body.password === undefined) {
      callback(new this.context.BadRequestError('Invalid user object. No password property found.'));
      return;
    }

    this.context.passwordManager.encryptPassword(requestObject.data.body.password)
      .then(encryptedPassword => {
        requestObject.data.body.password = encryptedPassword;

        callback(null, requestObject);
      })
      .catch(error => callback(error));
  };
};
