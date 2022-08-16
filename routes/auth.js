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

    if (!username || !password || !email) {
      errors.push({ msg: "Please fill in all fields" });
    }

    User.findOne({ email: email }, function (err, doc) {
      if (err) {
        req.flash('message', 'Could Not Add You !! DataBase may be Down !')
        res.redirect('/signup')
      }
      else {

        if (doc) {
          req.flash('message', 'Email is already Registered!\n Please login to continue!')
          res.redirect('/signup') //if user with same username already exist
        } else {
          res.render("confirmregister", {
            title: "Log Tracker | Confirm Register",
            email: emailUser,
          })

          var code = mail.SendCodeToUser(email);
          var regCode = new Status();
          regCode.email = email;
          regCode.code = code;
          var record = new User();
          record.email = email;
          record.code = code;
          record.username = username;
          record.password = record.hashPassword(password); //access method
          record.userstatus = status;
          record.level = level

          regCode.save(function (err, status) {
            //Save to database
            if (err) {
              console.log(err)
              req.flash('message', 'Error Occurred while adding the code')
            } else {
              req.flash('message', 'You are successfully added!')
            }
          });
          record.save(function (err, user) {
            //Save to database
            if (err) {
              console.log(err)
              req.flash('message', 'Error Occurred while adding you')
              // res.status(500).send("Database error occurred");
            } else {
              // res.render('/admin')
              req.flash('message', 'You are successfully added!')
            }
          });
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
  
  router.post("/activate", function (req, res) { 
    let errors = [];
    var body = req.body;
    email = body.email;
    User.findOne({ email: email }, function (err, doc) {
      if (err) {
        req.flash('message', 'Could not find the email.')
        res.redirect('/signup')
      } else {
        var newCode = mail.SendCodeToUser(email);
        Status.findOne({ email: email }, function (err, doc) {
          if (doc) {
            doc.code = newCode;
            doc.save(function (err,status){
              if (err) {
                req.flash('message', 'Could not find the email.')
              }
              else {
                req.flash('message', 'Code has been sent to your email.')
              }
            })
            res.render("confirmRegister", {
                title: "Log Tracker | Confirm Register",
                email: email,
              })
          }
        })
      }
    })
  })


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
          res.redirect('/');
          User.findOne({ email: email }, function (err, doc) { 
            if (doc) {
              doc.activateStatus = true;
              doc.save(function (err, user) {
                if (err) {
                  console.log(err)
                  req.flash('message', 'Successful')
                } else {
                  req.flash('message', 'Unsuccessful')
                }
              }
              )
            }
            else { 
              req.flash('message', 'Unsuccessful')
            }
          })
        }
        else {
          req.flash('message', 'Wrong Code')
        }
      }
    })
  });


  return router;
}
