var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Status = require("../models/Status");
var mail = require('../shared/Email');


module.exports = function (passport) {
  router.post("/signup", function (req, res) {
    let errors = [];

    var body = req.body,
    email = body.email,
    emailUser = email,
    username = body.username,
    password = body.password,
    status = body.userstatus;
    level = body.level
    console.log(body)

    if (!username || !password || !email) {
      errors.push({ msg: "Please fill in all fields" });
    }

    User.findOne({ email: email }, function (err, doc) {
      if (err) {
        // res.status(500).send("error occured");
        req.flash('message', 'Could Not Add You !! DataBase may be Down !')
        res.redirect('/signup')
      } //mongoose or database error
      else {
        if (doc) {
          req.flash('message', 'Email is already Registered!\n Please login to continue!')
          res.redirect('/signup') //if user with same username already exist
        } else {
          // res.redirect(url.format({
          //   pathname:"/confirmregister",
          //   query:emailUser,
          // }));
          res.render("confirmregister", {
            title: "Log Tracker | Confirm Register",
            email: emailUser,
          })
          var code = mail.SendCodeToUser(email);
          console.log(code)
          //Create new user
          // var code = new Status();
          // code.email = email;
          // code.code = code;
          // var record = new User();
          // record.email = email;
          // record.code = code;
          // record.username = username;
          // record.password = record.hashPassword(password); //access method
          // record.userstatus = status;
          // record.level = level
          // record.save(function (err, user) {
          //   //Save to database
          //   if (err) {
          //     console.log(err)
          //     req.flash('message', 'Error Occured while adding you')
          //     // res.status(500).send("Database error occured");
          //   } else {
          //     // res.render('/admin')
          //     req.flash('message', 'You are successfully added!')
          //     res.redirect("/");
          //   }
          // });
        }
      }
    });
  });

  // For Login using local strategy
  router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/",
      successRedirect: "/dashboard",
      failureFlash: true,
    })
  );

  router.post("/check", function (req, res) {
    let errors = [];

    var body = req.body;
    email = body.email;
    console.log(body)
    code = body.confirmCode;
    if (!email || !code ) {
      errors.push({ msg: "Please fill in all fields" });
    }

    Status.findOne({ email: email }, function (err, doc) { 
      if (doc) {
        if (doc.code == code) {
          res.redirect('/dashboard');
        }
        else { 
          req.flash('message', 'Wrong Code Please check you email and try again!')
        }
        res.redirect('/signup') //if user with same username already exist
      } else {
        req.flash('message', 'Email is already Registered!\n Please login to continue!')
      }
    })
    console.log(body)
  });


  return router;
};
