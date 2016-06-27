var
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(context) {
  this.verify = function(username, password, done) {
    context.accessors.users.load(username)
      .then(userObject => {
        if (userObject !== null) {
          context.passwordManager.checkPassword(password, userObject.password || userObject._source.password)
            .then(result => {
              if (result === false) {
                return done(new context.errors.ForbiddenError('Bad Credentials'));
              }

              done(null, userObject);
            });
        }
        else {
          done(new context.errors.ForbiddenError('Bad Credentials'));
        }
      })
      .catch(err => done(err));
  };

  this.load = function(passport) {
    passport.use(new LocalStrategy(this.verify));
  };
};
