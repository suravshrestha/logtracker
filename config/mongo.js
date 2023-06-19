const mongoose = require("mongoose");

//Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.Mongo_URI || "mongodb://localhost:27017/logtracker",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
