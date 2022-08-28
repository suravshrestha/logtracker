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
    "local",
    new localStrategy(
      {
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done, res) {
        User.findOne({ email: email }, function (err, user) {
          // if there are any errors, return the error before anything else
          if (err) return done(err)
          if (!user)
            return done(null, false, req.flash("message", "No user found.")) // req.flash is the way to set flashdata using connect-flash
          // if the user is found but the password is wrong
          if (!user.comparePassword(password, user.password))
            return done(
              null,
              false,
              req.flash("message", "Oops! Wrong password.")
            )

          if (user.activateStatus == false) {
            // res.render("confirmregister", {
            //   title: "Log Tracker | Confirm Register",
            //   email: email,
            // })
            return done(null, false, req.flash("message", "Email Not Activated."))
          }
          //return successful user in req.user or in req.session.passport.user
          return done(null, user, req.flash("message", "Logged in Successfully"))
        })
      }
    )
  )
}
