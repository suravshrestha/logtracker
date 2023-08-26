const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("querystring");

const User = require("../models/User");
const programs = require("../utils/programs");

/* GET users listing. */
router.get("/", async function (req, res) {
  const users = await User.find({});

  res.status(200).send({ count: users.length, users });
});

const queryStudentsApi = async (programCode, batch, group, students) => {
  const formData = { prog: programCode, batch, group };

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
      username + "." + name.split(" ")[0].toLowerCase() + "@pcampus.edu.np";

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
};

async function syncStudentsByProgramAndBatch(programCode, batch, students) {
  const foundProgram = programs.find((program) => program.code === programCode);

  if (!foundProgram) {
    return;
  }

  for (const group of foundProgram.groups) {
    await queryStudentsApi(programCode, batch, group, students);
  }
}

router.get("/sync", async (req, res) => {
  const students = [];

  const queryBatches = req.query.batches ? req.query.batches.split(",") : [];
  const queryProgramCodes = req.query.programcodes
    ? req.query.programcodes.split(",")
    : [];

  try {
    for (const batch of queryBatches) {
      for (const programCode of queryProgramCodes) {
        await syncStudentsByProgramAndBatch(programCode, batch, students);
      }
    }

    if (students.length > 0) {
      await User.insertMany(students);
    }

    res
      .status(200)
      .send({ message: "Students database synchronization successful." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An unexpected error occurred during synchronization." });
  }
});

module.exports = router;
