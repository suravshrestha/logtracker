var express = require("express");
var router = express.Router();
var Project = require("../models/Project");
var Event = require("../models/Event");
var File = require("../models/File");
var { loggedin } = require("../middleware/ensureLogin");
var upload = require("../middleware/multer");
var fs = require("fs");
var path = require("path");
var stream = require("stream");

// router.post("/createteams", function (req, res, next) {
//   //console.log(teamname)
//   var projectname = req.body.projectname;
//   var description = req.body.description;
//   // var std = req.body.std;
//   var teamname = req.body.teamname;
//   var username = req.user.username;
//   var semester = req.body.sems;
//   var faculty = req.body.faculty;
//   var subject = req.body.subject;
//   var level = req.body.level;
//   if (level == "masters") {
//     semester = "unselected";
//     faculty = "unselected";
//     subject = "unselected";
//   }

//   (supervisor = [req.body.supervisor1, req.body.supervisor2]),
//     (team = [
//       req.body.std1,
//       req.body.std2,
//       req.body.std3,
//       req.body.std4,
//       req.body.std5,
//     ]);

//   // team=["Ranju G.C.","Rahul Shah","Supriya Khadka","Prabin Paudel"]
//   if (!projectname) {
//     errors.push({
//       msg: "Please fill in all fields",
//     });
//   }
//   console.log("1", req.body.std1);
//   console.log("2", req.body.std2);
//   console.log("3", req.body.std3);
//   console.log("4", req.body.std4);
//   console.log("5", req.body.std5);
//   console.log("teamname", team);
//   const project = new Project();
//   project.projectname = projectname;
//   project.description = description;
//   project.supervisor = supervisor;
//   project.team = team;
//   project.createdBy = req.user.email;
//   project.updatedBy = req.user.email;
//   project.faculty = faculty;
//   project.semester = semester;
//   project.subject = subject;
//   project.teamname = teamname;
//   project.level = level;
//   Project.createProject(project, function (err, projects) {
//     //Save to database
//     if (err) {
//       console.log(err);
//       res.status(500).send("Database error occured");
//     } else {
//       res.redirect("/dashboard");
//     }
//   });
// });

router.get("/syncStudent", (req, res, next) => {
  res.send("Hello, this is a simple GET route!");
});
