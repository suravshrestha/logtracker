const config = require("../utils/config")
const mongoose = require("mongoose");

const Faculty = require("../models/Faculty");

const fs = require("fs");
const facultiesData = fs.readFileSync("./utils/faculties.json");
const faculties = JSON.parse(facultiesData);

//Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(
      config.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );

    Faculty.countDocuments({}, async (err, count) => {
      if (count == 0) {
        Faculty.insertMany(faculties);
      }
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
