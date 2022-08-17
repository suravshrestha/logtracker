var express = require("express");
var router = express.Router();
var User = require("../models/User");
var mail = require('../shared/Email');

router.use("/passwordReset", function (req, res, next) {  //when send token button is pressed
  var body = req.body,
    email = body.email; // to be used for sending token to email
  User.findOne({ email: email }, function (err, user) { //finding user by email
    if (err) {  //error in user.findOne. idk exactly when this err occurs
      // res.status(500).send("error occured");
      req.flash('message', 'some error occured')
    } else {
      if (user == null) { //if input email doesn't exist in database
        if (req.method == 'POST') { // when email form is submitted and email is not found, this occurs
          console.log('no such email found as well as ')
          req.flash('message', 'email not found')
          res.redirect('/forgotPassword') // redirecting back to email form,  /forgotPassword is in index.js
        } else if (req.method == 'GET') { // when redirected because wrong token was entered
          console.log('redirected catched, so not sending token again')
          res.render("passwordReset", { //rendering password reset screen where token is to be entered
            title: "Log Tracker | PasswordReset",
            message: req.flash('message', '')
          });
        }
      } else {  // if email exists in database
        // generating token. Token should be sent to gmail here

        const rndToken = mail.SendCodeToUser(email);
        user.resetToken = rndToken; //assigning generated token to given user
        user.save(function (err, user) {  //saving changes to database
          //Save to database
          if (err) {  // error in user.save
            console.log(err)
            req.flash('message', 'Error Occured while generating token')
            // res.status(500).send("Database error occured");
          } else {
            // res.render('/admin')
            req.flash('message', 'token sent to mail')
            res.render("passwordReset", { //rendering password reset page where token and new password is to be entered
              title: "Log Tracker | PasswordReset",
              message: req.flash('message', '')
            });
          }
        });
      }
    }
  })
});

router.use("/passwordTknVerify", function (req, res, next) {  //when reset password button is pressed
  if (req.method == 'GET'){
    console.log('err- get request has no meaning in this function')
  }
  var body = req.body,
    token = body.rstPwsTkn,
    newPassword = body.nwPwd,
    cmnwPassword = body.cnwPwd; // to be used for sending token to email

  if (!token || !newPassword || !cmnwPassword) {
    errors.push({ msg: "Please fill in all fields" });
  }
  User.findOne({ resetToken: token }, function (err, user) {  // if input token matches token sent to email, then newpassword can be changed
    if (err) {  // error in user.findone. idk exactly when this error occurs
      console.log('user.findone error');
      // res.status(500).send("error occured");
      req.flash('message', 'some error occured ')
      res.redirect('/pwdReset/passwordReset')
    } else {  //if no err
      if (user == null) { // if token is wrong , i.e, if input token doesn't match token of any user in database
        console.log('token did not match');
        req.flash('message', 'token did not match')
        res.redirect('/pwdReset/passwordReset') // redirect to passwordReset page where token and newpassword is to be entered
      } else {  // if token matches
        if (newPassword == cmnwPassword) {  
          console.log(user.username);
          user.password = user.hashPassword(newPassword); //applying new password
          user.save(function (err, user) {  //saving database
            //Save to database
            if (err) {
              console.log(err)
              req.flash('message', 'error occured while reseting')
              // res.status(500).send("Database error occured");
            } else {
              // res.render('/admin')
              req.flash('message', 'password reset successful')
              res.redirect("/");  // if saved successfully, then redirect to login page
            }
          });
        }else{
          req.flash('message', 'confirm password did not match the new password')
          res.redirect('/pwdReset/passwordReset')
        }
      }
    }
  })
});

module.exports = router;