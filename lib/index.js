var
  hooks = require('./config/hooks'),
  PasswordManager = require('./passwordManager'),
  Strategy = require('./passport/strategy');

module.exports = function () {

  this.isDummy = false;
  this.context = {};

  this.init = function (config, context, isDummy) {
    if (!config) {
      /*eslint no-console: 0*/
      console.error(new Error('plugin-auth-passport-local: A configuration is required for plugin kuzzle-plugin-auth-passport-local'));
      /*eslint no-console: 1*/
      return false;
    }
    if (!config.secret) {
      /*eslint no-console: 0*/
      console.error(new Error('plugin-auth-passport-local: The \'secret\' attribute is required'));
      /*eslint no-console: 1*/
      return false;
    }
    if (!config.algorithm) {
      /*eslint no-console: 0*/
      console.error(new Error('plugin-auth-passport-local: The \'algorithm\' attribute is required'));
      /*eslint no-console: 1*/
      return false;
    }
    if (!config.digest) {
      /*eslint no-console: 0*/
      console.error(new Error('plugin-auth-passport-local: The \'digest\' attribute is required'));
      /*eslint no-console: 1*/
      return false;
    }

    this.isDummy = isDummy;
    this.context = context;

    this.context.passwordManager = new PasswordManager(config);

    return this;
  };

  this.hooks = hooks;

  this.loadStrategy = function(passport) {
    var strategy = new Strategy(this.context);
    strategy.load(passport);
  };

};
