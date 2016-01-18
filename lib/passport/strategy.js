var
  q = require('q'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function (context) {
  this.verify = function (username, password, done) {
    var deferred = q.defer(),
      repositories = context.repositories();

    repositories.user.loadByUsernameAndPassword(username, password)
      .then(function (userObject) {
        if (userObject !== null) {
          deferred.resolve(userObject);
        }
        else {
          deferred.reject(new context.ForbiddenError('Bad Credentials'));
        }
      })
      .catch(err => deferred.reject(err));

    deferred.promise.nodeify(done);
    return deferred.promise;
  };

  this.load = function (passport) {
    passport.use(new LocalStrategy(this.verify));
  };
};
