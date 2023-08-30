const express = require("express");
const router = express.Router();
const Minute = require("../models/Minute");
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/multer");
const { loggedin } = require("../middleware/ensureLogin");
const stream = require("stream");

const commentRouter = require("./comment");

router.use("/comment", commentRouter);

//process minute form
// POST /minutes/add

router.post(
  "/save/:pId",
  upload.array("uploadedFiles", 10),
  (req, res) => {
    //console.log("save")
    const pId = req.params.pId;

    try {
      console.log(JSON.stringify(req.body));
      const errors = [];

      console.log(req.files);
      console.log(req.files.length);

      const title = req.body.title;
      const description = req.body.description;
      const img = new Array();
      console.log(pId);

      for (let i = 0; i < req.files.length; i++) {
        const file = {
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
        img.push(file);
        console.log(title);
      }
      if (!title || !description) {
        errors.push({
          msg: "Please fill in all fields",
        });
      }

      const minute = new Minute();
      minute.projectId = pId;
      minute.title = title;
      minute.description = description;
      minute.attachment = img;
      minute.createdBy = req.user.username;
      minute.createdDate = Date.now();
      Minute.createMinute(minute, function (err) {
        //Save to database
        if (err) {
          // res.status(500).send(err);
          req.flash("message", "Error Saving Minute");
          res.redirect("/student/eachProject/" + pId);
        } else {
          req.flash("message", "Minute Added");
          res.redirect("/student/eachProject/" + pId);
        }
      });
    } catch (err) {
      req.flash("message", "Unexpected error".concat(err));
      res.redirect("/student/eachProject/" + pId);
      // res.render(err);
      // res.redirect("/student/eachProject");
      // res.render
    }
  }
);

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

router.use("/getall/:pId", loggedin, (req, res) => {
  res.redirect("/student/eachProject/" + req.params.pId);
});

router.get("/download", function (req, response, next) {
  console.log(req.query);
  Minute.findOne(
    {
      "attachment.fileId": req.query.data,
    },
    function (err, minute) {
      if (err) {
        return next(err);
      } else {
        minute.attachment.forEach((element) => {
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

router.post("/edit/:pId/:mId", (req, res) => {
  const pId = req.params.pId;

  try {
    console.log(JSON.stringify(req.body));
    const errors = [];

    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
      errors.push({
        msg: "Please fill in all fields",
      });
    }

    const minute = new Minute();
    minute.title = title;
    minute.description = description;
    minute.updatedBy = req.user.username;
    console.log(minute);

    Minute.updateMinute(req.params.mId, minute, function (err) {
      //Save to database
      if (err) {
        // res.status(500).send(err);
        req.flash("message", "Error Editing Minute :".concat(err));
        res.redirect("/student/eachProject/" + pId);
      } else {
        req.flash("message", "Minute Edited Successfully");
        res.redirect("/student/eachProject/".concat(pId));
      }
    });
  } catch (err) {
    req.flash("message", "Unexpected error".concat(err));
    res.redirect("/student/eachProject/" + pId);
    // res.render(err);
    // res.redirect("/student/eachProject");
    // res.render
  }
});

router.use("/verify/:pId/:id", loggedin, (req, res, next) => {
  Minute.verifyMinute(req.params.id, function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect("/teacher/eachProject/" + req.params.pId);
    }
  });
});

router.use("/unverify/:pId/:id", loggedin, (req, res, next) => {
  Minute.unVerifyMinute(req.params.id, function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect("/teacher/eachProject/" + req.params.pId);
    }
  });
});

module.exports = router;

//TO-DO
