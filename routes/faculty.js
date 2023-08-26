const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");

//process minute form
// POST /minutes/add

router.use("/getall", async () => {
  const all = await Faculty.find({});
  global.faculty = all;
});

module.exports = router;

//TO-DO
