var express = require("express");
var router = express.Router();
const axios = require("axios");
const querystring = require("querystring");

const User = require("../models/User");
const batches = require("../utils/batches")

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const users = await User.find({});

  res.status(200).send({ count: users.length, users });
});

router.get("/sync", async (req, res, next) => {
  const programmes = [
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

  for (const batch of batches) {
    for (const programme of programmes) {
      for (const group of programme.group) {
        try {
          const formData = { prog: programme.prog, batch, group };

          const response = await axios.post(
            "http://assmnt.pcampus.edu.np/api/students/",
            querystring.stringify(formData)
          );

          // name: Samip Neupane
          // username: 077bct073
          // password: 077bct073
          // email: 077bct073.samip@pcampus.edu.np
          // userstatus: student
          for (const user of response.data) {
            const name = user[3];
            const username = user[0] + user[1].toLowerCase() + user[2];
            const email =
              username +
              "." +
              name.split(" ")[0].toLowerCase() +
              "@pcampus.edu.np";

            const usernameExists = await User.findOne({ username });

            if (!usernameExists) {
              const newUser = new User({
                name,
                username,
                email,
                password: username,
                userstatus: "student",
                level: "bachelors",
              });

              await newUser.save();
            }
          }
        } catch (error) {
          return res
            .status(500)
            .send({ error: "An unexpected error occurred." });
        }
      }
    }
  }

  res.status(200).send({ message: "Successfully synced students database." });
});

module.exports = router;
