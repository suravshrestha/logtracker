var express = require("express");
var router = express.Router();
var Faculty = require("../models/Faculty");

//process minute form
// POST /minutes/add

router.use("/getall", async (req, res, next) => {
  const all = await Faculty.find({});
  global.faculty = all;
});

module.exports = router;

//TO-DO
