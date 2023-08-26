
//to verify login
const loggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/");
    }
  };
  //to protecting from login bypass
  const ensureAuth = function(req, res, next){
    if(!req.isAuthenticated()) {
      return next();
    }else {
      res.redirect("/dashboard");
    }
  };

  module.exports = { loggedin, ensureAuth };
