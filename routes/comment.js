const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const { loggedin } = require("../middleware/ensureLogin");


//process comment form
// POST /comment/save

router.post("/save/:mId/:pId",(req, res) => {
  const pId = req.params.pId;
  try {
    console.log(JSON.stringify(req.body));
    const errors = [];

    const cmt = req.body.cmt;

    if (!cmt) {
      errors.push({
        msg: "Comment field cannot be empty!"
      });
    }

    const mId = mongoose.Types.ObjectId(req.params.mId);

    const comment = new Comment();
    comment.minuteId = mId;
    comment.comment = cmt;
    comment.commentedBy = req.user.username;

    // console.log(req.user.username)

    Comment.createComment(comment, function (err) {
      //Save to database
      if (err) {
        console.log(err);
        req.flash("message", "Error Commenting : ".concat(err));
        if (req.user.userstatus === "student"){
          res.redirect("/student/eachProject/".concat(pId));
        }else if(req.user.userstatus === "teacher"){
        res.redirect("/teacher/eachProject/".concat(pId));
        }
        // res.status(500).send("Database error occured");
      } else {
        req.flash("message", "Comment Added");
        if (req.user.userstatus === "student"){
          res.redirect("/student/eachProject/".concat(pId));
        }else if(req.user.userstatus === "teacher"){
        res.redirect("/teacher/eachProject/".concat(pId));
      }
      }
    }
    );
  }

  catch (err) {
    console.error(err);
    req.flash("message","Cannot Complete task : ".concat(err));
    if (req.user.userstatus === "student"){
      res.redirect("/student/eachProject/".concat(pId));
    }else if(req.user.userstatus === "teacher"){
    res.redirect("/teacher/eachProject/".concat(pId));
    }
  }

});

router.use("/getall", loggedin, (req, res, next) => {
  Comment.getCommentsbyId("minuteid", function (err, comments) {
    if (err) {
      req.flash("message","Cannot Complete task : ".concat(err));
      return next(err);
    } else {
      res.send(comments);
    }
  });
});

router.use("/delete/:id/:pId", loggedin, (req, res, next) => {
  const pId = req.params.pId;
  console.log(req.params.id);
  Comment.findById({ _id:req.params.id }, function (err, cmt) {
    if (cmt.commentedBy === req.user.username) {
      Comment.deleteComment(req.params.id, function (err) {
        if (err) {
          req.flash("message","Cannot Delete Comment : ".concat(err));
          return next(err);
        } else {
          req.flash("message","Comment Deleted");
          if (req.user.userstatus === "student"){
            res.redirect("/student/eachProject/".concat(pId));
          }else if(req.user.userstatus === "teacher"){
          res.redirect("/teacher/eachProject/".concat(pId));
        }
        }
      });
    }
  });

  });

  module.exports = router;
