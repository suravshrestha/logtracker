var express = require("express");
var router = express.Router();
const axios = require("axios");
const querystring = require("querystring");

const User = require("../models/User");
const batches = require("../utils/batches");
const programs = require("../utils/programs");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const users = await User.find({});

  res.status(200).send({ count: users.length, users });
});

router.get("/sync", async (req, res, next) => {
  const students = [];

  try {
    for (const batch of batches) {
      for (const program of programs) {
        for (const group of program.groups) {
          const formData = { prog: program.code, batch, group };

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
              const user = {
                name,
                username,
                email,
                password: new User().hashPassword(username),
                userstatus: "student",
                level: "bachelors",
              };

              students.push(user);
            }
          }
        }
      }
    }

    if (students.length > 0) {
      await User.insertMany(students);
    }

    res.status(200).send({ message: "Successfully synced students database." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "An unexpected error occurred." });
  }
});

module.exports = router;
