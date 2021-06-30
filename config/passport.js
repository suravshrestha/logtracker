var localStrategy = require("passport-local").Strategy;
var User = require("../models/User");

module.exports = function (passport) {
  //Add user to Session
  passport.serializeUser(function (user, done) {
    done(null, user); //err = null
  });
  //Remove User from Session
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new localStrategy(
      //{ usernameField:"", passwordField:"" }
      function (username, password, done) {
        //done is used to verify callback
        //Our Strategy goes here (find in database)
        User.findOne({ username: username }, function (err, doc) {
          if (err) {
            done(err);
            console.log("Error Logging !!");
          } else {
            if (doc) {
              //document is present
              var valid = doc.comparePassword(password, doc.password);
              if (valid) {
                done(null, {
                  username: doc.username,
                  password: doc.password,
                });
              } else {
                console.log("Incorrect Password");
                return done(null, false, { message: "Incorrect password" });
              }
            } else {
              console.log("User not found");
              return done(null, false, { message: "User not found" });
            }
          }
        });
      }
    )
  );
};