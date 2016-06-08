var
  q = require('q'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(context) {
  this.verify = function(username, password, done) {
    var
      deferred = q.defer(),
      repositories = context.repositories();

    repositories.user.load(username)
      .then(userObject => {
        if (userObject !== null) {
          context.passwordManager.checkPassword(password, userObject.password || userObject._source.password)
            .then(result => {
              if (result === false) {
                deferred.reject(new context.ForbiddenError('Bad Credentials'));
              }
              else {
                deferred.resolve(userObject);
              }
            });
        }
        else {
          deferred.reject(new context.ForbiddenError('Bad Credentials'));
        }
      })
      .catch(function (err) {
        deferred.reject(err);
      });

    deferred.promise.nodeify(done);
    return deferred.promise;
  };

  this.load = function(passport) {
    passport.use(new LocalStrategy(this.verify));
  };
};
