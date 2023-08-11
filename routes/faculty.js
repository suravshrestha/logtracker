var express = require("express");
var router = express.Router();
var Faculty = require("../models/Faculty");
const axios = require("axios");
const querystring = require("querystring");

//process minute form
// POST /minutes/add

router.use("/save", (req, res, next) => {
  try {
    console.log(JSON.stringify(req.body));

    const faculty = new Faculty();
    faculty.name = "Aerospace Engineering";
    faculty.courses = [
      {
        semester: 1,
        subjects: [
          "Mathematics I",
          "Applied Mechanics",
          "Engineering Drawing",
          "Engineering Physics",
          "Basic Electrical Engineering",
          "Workshop Technology",
        ],
      },
      {
        semester: 2,
        subjects: [
          "Mathematics II",
          "Engineering Drawing II",
          "Basic Electronics Engineering",
          "Engineering Chemistry",
          "C Programming",
          "Fundamental of Thermodynamics & Heat Transfer",
        ],
      },
      {
        semester: 3,
        subjects: [
          "Applied Thermodynamics and Heat Transfer",
          "Computer Aided Design and Manufacturing",
          "Engineering Mechanics",
          "Fluid Mechanics",
          "Fundamental of Aerospace Engineering",
          "Engineering Mathemathics III",
        ],
      },
      {
        semester: 4,
        subjects: [
          "Theory of Mechanism and Machine I",
          "Aerodynamics",
          "Aerospace Materials",
          "Control System",
          "Probabillity and Statistics",
          "Strength of Materials",
        ],
      },
      {
        semester: 5,
        subjects: [
          "Aircraft Manufacturing Process",
          "Aircraft Propulsion",
          "Continuum Mechanics",
          "Fault Monitoring and Diagnosis",
          "Numerical Methods",
          "Theory of Vibration",
        ],
      },
      {
        semester: 6,
        subjects: [
          "Avionics",
          "Finite Element Method",
          "Aircraft Maintenance Engineering",
          "Aircraft Environment Control System",
          "Flight Dynamics",
          "Unmanned Air Vehicle Synthesis",
        ],
      },
      {
        semester: 7,
        subjects: [
          "Aircraft Preliminary Design",
          "Computational Fluid Dynamics",
          "Air Traffic Management",
          "Aircraft Structures",
          "Embedded Systems in Avionics",
          "Project(Part I)",
          "Elective I",
        ],
      },
      {
        semester: 8,
        subjects: [
          "Internship",
          "Aviation Professional Practices",
          "Factor in Aviation",
          "Elective II",
          "Elective III",
          "Project(Part II)",
        ],
      },
    ];

    Faculty.addFaculty(faculty, function (err, faculty) {
      //Save to database
      if (err) {
        // res.status(500).send(err);
        req.flash("message", "Error Saving Minute");
        // res.redirect("/student/eachProject/" + pId);
      } else {
        req.flash("message", "Subjects Added");
        // res.redirect("/student/eachProject/" + pId);
        res.send(faculty);
      }
    });
  } catch (err) {
    req.flash("message", "Unexpected error".concat(err));
    // res.redirect("/student/eachProject/" + pId);
    // res.render(err);
    // res.redirect("/student/eachProject");
    // res.render
  }
});

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
