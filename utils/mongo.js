const config = require("../utils/config");
const mongoose = require("mongoose");

const User = require("../models/User");
const Faculty = require("../models/Faculty");

const fs = require("fs");
const facultiesData = fs.readFileSync("./utils/faculties.json");
const faculties = JSON.parse(facultiesData);

//Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    Faculty.countDocuments({}, async (err, count) => {
      if (count == 0) {
        Faculty.insertMany(faculties);
      }
    });

    const existingAdmin = await User.findOne({ userstatus: "admin" });

    if (existingAdmin) {
      return;
    }

    const admin = new User({
      name: config.ADMIN_NAME,
      email: config.ADMIN_EMAIL,
      username: config.ADMIN_USERNAME,
      userstatus: "admin",
    });

    admin.password = await admin.hashPassword(config.ADMIN_PASSWORD);

    await admin.save();

    console.log("Admin created");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
