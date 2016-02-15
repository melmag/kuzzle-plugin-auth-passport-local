var
  _ = require('lodash'),
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

  this.cleanUserCredentials = function(user, callback) {
    try {
      delete user.password;
      callback(null, user);
    }
    catch (error) {
      callback(error);
    }
  };

  this.encryptCredentials = function(requestObject, callback) {
    if (requestObject.data.body.password === undefined) {
      // The plugin does not enforce the password in case another plugin is installed
      // @todo: add some configuration check on whether to trigger an error
      return callback(null, requestObject);
    }

    if (!_.isString(requestObject.data.body.password)) {
      return callback(new this.context.BadRequestError('Missing or invalid given property: password'));
    }

    if (requestObject.data.body.password.trim() === '') {
      return callback(new this.context.BadRequestError('Empty password is not allowed'));
    }

    this.context.passwordManager.encryptPassword(requestObject.data.body.password)
      .then(encryptedPassword => {
        var pjson = require('../package.json');

        requestObject.data.body.password = encryptedPassword;

        if (requestObject.metadata === undefined) {
          requestObject.metadata = {};
        }
        if (requestObject.metadata.pipes === undefined) {
          requestObject.metadata.pipes = [];
        }

        // add some information back to the user
        requestObject.metadata.pipes.push({
          plugin: pjson.name,
          trigger: 'encryptPassword'
        });

        callback(null, requestObject);
      })
      .catch(error => callback(error));
  };
};
