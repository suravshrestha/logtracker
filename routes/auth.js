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
      }
      else {

        if (doc) {
          req.flash('message', 'Email is already Registered!\n Please login to continue!')
          res.redirect('/') //if user with same username already exist
        } else {
          res.render("confirmRegister", {
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

  router.use("/activate", function (req, res) {
    console.log('activate')
    // let errors = [];
    var body = req.body;
    email = body.email;
    User.findOne({ email: email }, function (err, doc) {
      if (doc) {
        console.log('user found')
        var newCode = mail.SendCodeToUser(email);
        Status.findOne({ email: email }, function (err, doc) {
          if (doc) {
            console.log('status found')
            doc.code = newCode;
            doc.save(function (err, status) {
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
          else {
            console.log('cant find user')
            req.flash('message', 'Could not find the email.')
          }
        })
      }
      else {
        req.flash('message', 'Could not find the email. Check if email is correct.')
        res.redirect("/")
      }
    }
    )
  })


  router.use("/check", function (req, res) {
    console.log('check')
    let errors = [];
    var body = req.body;
    email = body.email;
    console.log(body)
    code = body.confirmCode;
    if (!email || !code) {
      errors.push({ msg: "Please fill in all fields" });
    }
    Status.findOne({ email: email }, function (err, doc) {
      console.log('status found')
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
          res.redirect('/')
        }
      }
      else {
        req.flash('message', 'Please check your Email')
      }
    })
  });


  return router;
}
