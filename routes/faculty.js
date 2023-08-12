var express = require("express");
var router = express.Router();
var Faculty = require("../models/Faculty");
const axios = require("axios");
const querystring = require("querystring");

//process minute form
// POST /minutes/add

router.get("/sync", async (req, res, next) => {
  const data = [
    {
      prog: "BCT",
      year: ["1", "2", "3", "4"],
      part: ["1", "2"],
    },

    {
      prog: "BEI",
      year: ["1", "2", "3", "4"],
      part: ["1", "2"],
    },
    {
      prog: "BEL",
      year: ["1", "2", "3", "4"],
      part: ["1", "2"],
    },
    {
      prog: "BME",
      year: ["1", "2", "3", "4"],
      part: ["1", "2"],
    },
    {
      prog: "BAE",
      year: ["1", "2", "3", "4"],
      part: ["1", "2"],
    },
    {
      prog: "BCE",
      year: ["1", "2", "3", "4"],
      part: ["1", "2"],
    },
  ];

  for (let i = 0; i < data.length; i++) {
    let faculty;
    const prog = data[i].prog;
    const yearArr = data[i].year;
    const partArr = data[i].part;
    let part;
    let responseDataMap;
    faculty = new Faculty();
    faculty.name = prog;
    faculty.courses = [];

    let semCount = 0;

    for (let j = 0; j < yearArr.length; j++) {
      const year = yearArr[j];

      for (let k = 0; k < partArr.length; k++) {
        semCount += 1;
        part = partArr[k];

        try {
          const formData = {
            prog: prog,
            year: year,
            part: part,
          };

          const response = await axios.post(
            "http://assmnt.pcampus.edu.np/api/subjects/",
            querystring.stringify(formData)
          );

          const responseData = response.data;
          responseDataMap = responseData.map((item) => {
            return item[1];
          });

          faculty.courses.push({
            semester: semCount,
            subjects: responseDataMap,
          });

          console.log("Success");
        } catch (error) {
          console.error("Error:", error);
          res.status(500).send("An error occurred");
        }
      }
    }

    try {
      Faculty.addFaculty(faculty, function (err, faculty) {
        //Save to database
        if (err) {
          // res.status(500).send(err);
          req.flash("message", "Error Saving Minute");
          res.status(500).send("An error occurred"); // Send an error response

          // res.redirect("/student/eachProject/" + pId);
        } else {
          req.flash("message", "Subjects Added");
          // res.redirect("/student/eachProject/" + pId);
          res.send(faculty);
        }
      });
    } catch (err) {
      req.flash("message", "Unexpected error".concat(err));
      res.status(500).send("An error occurred"); // Send an error response
    }
  }
});

router.use("/getall", async (req, res, next) => {
  const all = await Faculty.find({});
  global.faculty = all;
});

module.exports = router;

//TO-DO
