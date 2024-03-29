const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Event = require("../models/Event");
const File = require("../models/File");
const { loggedin } = require("../middleware/ensureLogin");
const upload = require("../middleware/multer");
const fs = require("fs");
const path = require("path");
const stream = require("stream");


router.post("/createteams", function (req, res) {
  //console.log(teamname)
  const projectname = req.body.projectname;
  const description = req.body.description;
  // const std = req.body.std;
  const teamname = req.body.teamname;
  let semester = req.body.sems;
  let faculty = req.body.faculty;
  let subject = req.body.subject;
  const level = req.body.level;
  if(level === "masters"){
    semester = "unselected";
    faculty = "unselected";
    subject = "unselected";
  }

  const supervisor = [req.body.supervisor1, req.body.supervisor2];
  const team = [
      req.body.std1,
      req.body.std2,
      req.body.std3,
      req.body.std4,
      req.body.std5,
  ];
  // team=["Ranju G.C.","Rahul Shah","Supriya Khadka","Prabin Paudel"]

  console.log("1", req.body.std1);
  console.log("2", req.body.std2);
  console.log("3", req.body.std3);
  console.log("4", req.body.std4);
  console.log("5", req.body.std5);
  console.log("teamname", team);
  const project = new Project();
  project.projectname = projectname;
  project.description = description;
  project.supervisor = supervisor;
  project.team = team;
  project.createdBy = req.user.email;
  project.updatedBy = req.user.email;
  project.faculty = faculty;
  project.semester = semester;
  project.subject = subject;
  project.teamname = teamname;
  project.level = level;
  Project.createProject(project, function (err) {
    //Save to database
    if (err) {
      console.log(err);
      res.status(500).send("Database error occured");
    } else {
      res.redirect("/dashboard");
    }
  });
});

router.post("/editteams/:pId", function (req, res) {
  const pId = req.params.pId;
  const projectname = req.body.projectname;
  const description = req.body.description;
  const teamname = req.body.teamname;
  const semester = req.body.sems;
  const supervisor = [req.body.supervisor1, req.body.supervisor2];
    const team = [
      req.body.std1,
      req.body.std2,
      req.body.std3,
      req.body.std4,
      req.body.std5,
    ];
  // team=["Ranju G.C.","Rahul Shah","Supriya Khadka","Prabin Paudel"]

  const project = new Project();
  project.projectname = projectname;
  project.description = description;
  project.supervisor = supervisor;
  project.team = team;
  project.createdBy = req.user.email;
  project.updatedBy = req.user.email;
  // project.faculty = faculty;
  project.semester = semester;
  // project.subject = subject;
  project.teamname = teamname;
  console.log(project);
  Project.updateProject(pId, project, function (err) {
    //Save to database
    if (err) {
     console.log(err);
      res.status(500).send("Database error occured");
    } else {
      res.redirect("/dashboard");
    }
  });
});

router.post("/uploadFiles/:projectId", upload.array("uploadedFiles", 10), (req, res) => {
  //console.log(teamname)
  try {
    console.log(JSON.stringify(req.body));

    const uploadedFile = new Array();
    for (let i = 0; i < req.files.length; i++) {
      const data = {
        name: req.files[i].filename,
        fileId: ID(),
        docs: {
          data: fs.readFileSync(
            path.join(
              __dirname,
              ".." + "/public/uploads/" + req.files[i].filename
            )
          ),
          contentType: req.files[i].mimetype,
        },
      };
      uploadedFile.push(data);
    }

    const file = new File();
    file.projectId = req.params.projectId;
    file.title = req.body.title;
    file.description = req.body.description;
    file.attachment = uploadedFile;

    File.addFile(file, function (err) {
      //Save to database
      if (err) {
        console.log(err);
        res.status(500).send("Database error occured");
      } else {
        res.redirect("/dashboard");
      }
    });
  } catch (err) {
    req.flash("message", "Unexpected error".concat(err));
    // res.redirect("/student/eachProject/" + pId);
    res.render(err);
    // res.redirect("/student/eachProject");
    // res.render
  }

});

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

router.get("/files/download", function (req, response, next) {
  console.log(req.query);
  File.findOne(
    {
      "attachment.fileId": req.query.data,
    },
    function (err, file) {
      console.log(file);
      if (err) {
        return next(err);
      } else {
        file.attachment.forEach((element) => {
          if (element.fileId === req.query.data) {
            const fileType = element.docs.contentType;
            const fileName = element.name.substring(
              element.name.indexOf("-") + 1
            );
            const fileData = element.docs.data;

            const fileContents = Buffer.from(fileData, "base64");
            const readStream = new stream.PassThrough();
            readStream.end(fileContents);

            response.set(
              "Content-disposition",
              "attachment; filename=" + fileName
            );
            response.set("Content-Type", fileType);

            readStream.pipe(response);
          }
        });
      }
    }
  );
});

router.post("/event/save/:pId", (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    const errors = [];

    const title = req.body.title;
    const dueDate = new Date(req.body.eventDate);
    dueDate.setHours(23);
    dueDate.setMinutes(59);
    dueDate.setSeconds(59);
    const description = req.body.description;
    const pId = req.params.pId;
    if (!title) {
      errors.push({
        msg: "Add event field cannot be empty!",
      });
    }

    // const mId = mongoose.Types.ObjectId(req.params.mId);

    const event = new Event();
    event.projectId = pId;
    event.event = title;
    event.dueDate = dueDate;
    event.createdBy = req.user.username;
    event.description = description;
    console.log(event);

    Event.createEvent(event, function (err) {
      //Save to database
      if (err) {
        console.log(err);
        req.flash("message", "Error Saving Event");
        if (req.user.userstatus === "student") {
          res.redirect("/student/eachProject/".concat(pId));
        } else if (req.user.userstatus === "teacher") {
          res.redirect("/teacher/eachProject/".concat(pId));
        }
      } else {
        req.flash("message", "Event Added");
        if (req.user.userstatus === "student") {
          res.redirect("/student/eachProject/".concat(pId));
        } else if (req.user.userstatus === "teacher") {
          res.redirect("/teacher/eachProject/".concat(pId));
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/defenceComment/:pId", (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    const pId = req.params.pId;

    let message = {};

    Project.findById(pId, function (err, project) {
      //Save to database
      console.log(project);
      if (err) {
        console.log(err);
        res.status(500).send("Database error occured");
      } else {
        if (project.midDefence.approved === true) {
          message = {
            comment: req.body.cmt,
            option: "final",
            commentedBy: req.user.username,
          };
        } else {
          message = {
            comment: req.body.cmt,
            option: "mid",
            commentedBy: req.user.username,
          };
        }
        Project.comment(pId, message, function (err) {
          //Save to database
          if (err) {
            console.log(err);
            res.status(500).send("Database error occured");
          } else {
            if (req.user.userstatus === "student") {
              res.redirect("/student/eachProject/".concat(pId));
            } else if (req.user.userstatus === "teacher") {
              res.redirect("/teacher/eachProject/".concat(pId));
            }
          }
        });

      }
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/requestApproveDefence/:pId", loggedin, (req, res) => {
  const pId = req.params.pId;
  const userstatus = req.user.userstatus;
  console.log(userstatus);
  const message = req.body.message;
  Project.findById(pId, function (err, project) {
    //Save to database
    console.log(project);
    if (err) {
      console.log(err);
      res.status(500).send("Database error occured");
    } else {
      if (project.midDefence.approved === true) {

        if ((userstatus === "student")) {
          Project.requestFinalDefence(pId, message, function (err) {
            //Save to database
            if (err) {
              console.log(err);
              res.status(500).send("Database error occured");
            }
          });
        }
        else if ((userstatus === "teacher")) {
          Project.approveFinalDefence(pId, function (err) {
            //Save to database
            if (err) {
              console.log(err);
              res.status(500).send("Database error occured");
            }
          });
        }

      } else {
        if ((userstatus === "student")) {
          Project.requestMidDefence(pId, message, function (err) {
            //Save to database
            if (err) {
              console.log(err);
              res.status(500).send("Database error occured");
            }
          });
        }
        else if ((userstatus === "teacher")) {
          Project.approveMidDefence(pId, function (err) {
            //Save to database
            if (err) {
              console.log(err);
              res.status(500).send("Database error occured");
            }
          });
        }
      }
      if (req.user.userstatus === "student") {
        res.redirect("/student/eachProject/".concat(pId));
      } else if (req.user.userstatus === "teacher") {
        res.redirect("/teacher/eachProject/".concat(pId));
      }
    }

  });
});

router.post("/defenseCall", loggedin, (req, res) => {
  console.log(req.body);

  const query = {
    faculty: req.body.faculty,
    subject: req.body.subject,
    semester: req.body.sems
  };
  if(req.body.level === "masters"){
    query.faculty = "unselected";
    query.subject = "unselected";
    query.semester = "unselected";
  }
  console.log(query);

  const defense = {
    date: new Date(req.body.defenseDate),
    time: req.body.defenseTime,
    term: req.body.terms,
  };

  Project.find(query, function (err, projects) {
    //Save to database
    console.log(projects);
    if (err) {
      console.log(err);
      res.status(500).send("Database error occured");
    } else {
      projects.forEach(project => {
        if (defense.term === "mid") {
          Project.callMidDefence(project._id, defense, function (err) {
            //Save to database
            if (err) {
              console.log(err);
              res.status(500).send("Database error occured");
            }
          });
          const query = { event: "Mid-Term Defense", projectId: project._id },
            update = {
              event: "Mid-Term Defense",
              dueDate: defense.date,
              createdBy: "Co-ordinator",
              description: req.body.description
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };
          Event.findOneAndUpdate(query, update, options, function (error, result) {
            console.log(result);
            if (error) console.log(error);
          });
        } else if (defense.term === "final") {
          Project.callFinalDefence(project._id, defense, function (err) {
            //Save to database
            if (err) {
              console.log(err);
              res.status(500).send("Database error occured");
            }
          });

          const query = { event: "Final Defense", projectId: project._id },
            update = {
              event: "Final Defense",
              dueDate: defense.date,
              createdBy: "Co-ordinator",
              description: req.body.description
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

          // Find the document
          Event.findOneAndUpdate(query, update, options, function (error, result) {
            console.log(result);
            if (error) console.log(error);
          });
        }
      });
      res.redirect("/dashboard");
    }

  });
});


router.use("/event/completed/:pId/:id/:title", loggedin, (req, res, next) => {
  Event.Completed(req.params.id, function (err) {
    const pId = req.params.pId;
    if (req.params.title === "Final Defense") {
      Project.completeProject(pId, function () { });
    }
    if (err) {
      req.flash("message", "Cannot Complete task : ".concat(err));
      return next(err);
    } else {
      req.flash("message", "Task Completed");
      if (req.user.userstatus === "student") {
        res.redirect("/student/eachProject/".concat(pId));
      } else if (req.user.userstatus === "teacher") {
        res.redirect("/teacher/eachProject/".concat(pId));
      }
    }
  });
});

router.use("/event/remaining/:pId/:id", loggedin, (req, res, next) => {
  Event.Remaining(req.params.id, function (err) {
    const pId = req.params.pId;
    if (err) {
      req.flash("message", "Cannot Complete task : ".concat(err));
      return next(err);
    } else {
      if (req.user.userstatus === "student") {
        res.redirect("/student/eachProject/".concat(pId));
      } else if (req.user.userstatus === "teacher") {
        res.redirect("/teacher/eachProject/".concat(pId));
      }
    }
  });
});

module.exports = router;
