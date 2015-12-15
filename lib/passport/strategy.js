var
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(context){

    this.verify = function(username, password, done) {
      var deferred = q.defer();

      deferred.resolve({_id: username, password: password});

      deferred.promise.nodeify(done);
      return deferred.promise;
    };

    this.load = function(passport, context) {
      passport.use(new LocalStrategy(this.verify));
    };
};
