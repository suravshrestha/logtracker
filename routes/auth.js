var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Status = require("../models/Status");
var mail = require('../shared/Email');



module.exports = function (passport) {
  router.post("/signup", async (req, res) => {
    try {
      const { name, email, username, password, userstatus, level } = req.body;

      if (!name || !username || !password || !email) {
        return res
          .status(400)
          .json({ error: "Please fill in all required fields." });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({
            error:
              "This email is already registered. Please log in to continue.",
          });
      }

      const code = mail.SendCodeToUser(email);

      const regCode = new Status();
      regCode.email = email;
      regCode.code = code;

      const newUser = new User();
      newUser.name = name;
      newUser.email = email;
      newUser.code = code;
      newUser.username = username;
      newUser.password = newUser.hashPassword(password);
      newUser.userstatus = userstatus;
      newUser.level = level;

      await Promise.all([regCode.save(), newUser.save()]);

      res
        .status(200)
        .json({ message: "You have been successfully registered!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error:
            "An error occurred while processing your request. Please try again later.",
        });
    }
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
    const body = req.body;
    const email = body.email;
    User.findOne({ email: email }, function (err, doc) {
      if (doc) {
        doc.activateStatus = true;
        doc.save();
        res.json({"message": `Activated user <${email}>`})
      }
      else {
        res.json({"message": "Email doesn't exist. Check if the email is correct."})
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
