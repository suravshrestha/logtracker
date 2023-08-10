var express = require("express");
var router = express.Router();
const axios = require("axios");
const querystring = require("querystring");
const User = require("../models/User");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

router.get("/sync", async (req, res, next) => {
  batches = ["075", "076", "077", "078"];
  programmes = [
    {
      prog: "BCT",
      group: ["A", "B", "C", "D"],
    },
    {
      prog: "BEL",
      group: ["A", "B"],
    },
    {
      prog: "BAS",
      group: ["A", "B"],
    },
    {
      prog: "BCE",
      group: ["A", "B", "C", "D", "E", "F", "G", "H"],
    },
    {
      prog: "BAR",
      group: ["A", "B"],
    },
    {
      prog: "BME",
      group: ["A", "B"],
    },
    {
      prog: "BEI",
      group: ["A", "B"],
    },
  ];

  for (let i = 0; i < batches.length; i++) {
    const currentBatch = batches[i];
    for (let j = 0; j < programmes.length; j++) {
      const currentProgram = programmes[j];
      for (let k = 0; k < currentProgram.group.length; k++) {
        try {
          const formData = {
            prog: currentProgram.prog,
            batch: currentBatch,
            group: currentProgram.group[k],
          };

          const response = await axios.post(
            "http://assmnt.pcampus.edu.np/api/students/",
            querystring.stringify(formData)
          );

          // name: Samip Neupane
          // username: 077bct073
          // password: 077bct073
          // email: 077bct073.samip@pcampus.edu.np
          // userstatus: student
          for (let u = 0; u < response.data.length; u++) {
            const name = response.data[u][3];
            const username =
              response.data[u][0] +
              response.data[u][1].toLowerCase() +
              response.data[u][2];
            const email =
              username +
              "." +
              name.split(" ")[0].toLowerCase() +
              "@pcampus.edu.np";

            const usernameExists = await User.findOne({ username });

            if (!usernameExists) {
              const newUser = new User();
              newUser.name = name;
              newUser.username = username;
              newUser.email = email;
              newUser.password = username;
              newUser.userstatus = "student";

              await newUser.save();
              // console.log(email);
            }
          }
          // console.log("Response:", response.data);
          console.log("Success");
        } catch (error) {
          console.error("Error:", error);
          res.status(500).send("An error occurred");
        }
      }
    }
  }

  console.log("here");
});
