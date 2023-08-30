const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Status = require("../models/Status");
const mail = require("../shared/Email");

module.exports = function (passport) {
  router.post("/signup", async (req, res) => {
    try {
      const { name, email, username, password, userstatus, level } = req.body;

      if (!name || !username || !password || !email) {
        return res
          .status(400)
          .json({ error: "Please fill in all required fields." });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long." });
      }

      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          error: "This email is already registered. Please log in to continue.",
        });
      }

      const usernameExists = await User.findOne({ username });

      if (usernameExists) {
        return res.status(400).json({
          error:
            "This username is already registered. Please log in to continue.",
        });
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.np$/;

      if (!emailPattern.test(email)) {
        return res.status(400).json({
          error: "Please provide a valid email address with domain 'edu.np'.",
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
        .status(201)
        .json({ message: "You have been successfully registered!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error:
          "An error occurred while processing your request. Please try again later.",
      });
    }
  });

  // For Login using local strategy
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        // Authentication failed, redirect to '/'
        return res.redirect("/");
      }

      // Check if it's the user's first login (you need to have this logic defined)
      if (user.firstLogin) {
        // It's the user's first login, redirect to change-password route
        req.flash("message", "");
        return res.redirect("/change-password");
      }

      // It's not the first login, redirect to the dashboard
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        return res.redirect("/dashboard");
      });
    })(req, res, next);
  });

  router.post("/change-password", async (req, res) => {
    const { email, password, newPassword, confirmNewPassword } = req.body;

    try {
      if (!email || !password || !newPassword || !confirmNewPassword) {
        req.flash("message", "Please fill all the fields");
        return res.redirect("/change-password");
      }

      const user = await User.findOne({ email });

      if (!user) {
        const error = "User not found";
        req.flash("message", error);
        return res.redirect("/change-password");
      }

      if (!user.comparePassword(password, user.password)) {
        const error = "Invalid old password";
        req.flash("message", error);
        return res.redirect("/change-password");
      }

      if (newPassword !== confirmNewPassword) {
        const error = "New password and confirm new password don't match";
        req.flash("message", error);
        return res.redirect("/change-password");
      }

      // Update the user's password
      user.password = user.hashPassword(newPassword);
      user.firstLogin = false;
      await user.save();

      req.flash("message", "Password change successful");
      return res.redirect("/");
    } catch (error) {
      console.error("Error occurred:", error);
      req.flash(
        "message",
        "An error occurred while processing your request. Please try again later."
      );
    }
  });

  router.use("/activate", function (req, res) {
    const body = req.body;
    const email = body.email;
    User.findOne({ email: email }, function (err, doc) {
      if (doc) {
        doc.activateStatus = true;
        doc.save();
        res.json({ message: `Activated user <${email}>` });
      } else {
        res.json({
          message: "Email doesn't exist. Check if the email is correct.",
        });
      }
    });
  });

  router.use("/check", function (req, res) {
    console.log("check");
    const errors = [];
    const body = req.body;
    const email = body.email;
    console.log(body);
    const code = body.confirmCode;
    if (!email || !code) {
      errors.push({ msg: "Please fill in all fields" });
    }
    Status.findOne({ email: email }, function (err, doc) {
      console.log("status found");
      if (doc) {
        if (doc.code === code) {
          res.redirect("/");
          User.findOne({ email: email }, function (err, doc) {
            if (doc) {
              doc.activateStatus = true;
              doc.save(function (err) {
                if (err) {
                  console.log(err);
                  req.flash("message", "Successful");
                } else {
                  req.flash("message", "Unsuccessful");
                }
              });
            } else {
              req.flash("message", "Unsuccessful");
            }
          });
        } else {
          req.flash("message", "Wrong Code");
          res.redirect("/");
        }
      } else {
        req.flash("message", "Please check your Email");
      }
    });
  });

  return router;
};
