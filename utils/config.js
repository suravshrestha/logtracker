require("dotenv").config();

const PORT = process.env.PORT || 3000;

const SMTP_SERVER = process.env.SMTP_SERVER || "smtp.ethereal.email";
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

// Set the MongoDB URI based on the current environment
let MONGODB_URI;
if (process.env.NODE_ENV === "production") {
  MONGODB_URI = process.env.PRODUCTION_MONGODB_URI;
} else if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
} else {
  MONGODB_URI =
    process.env.DEVELOPMENT_MONGODB_URI ||
    "mongodb://0.0.0.0:27017/logtracker";
}

const SECRET = process.env.SECRET;

module.exports = {
  PORT,
  MONGODB_URI,
  SMTP_SERVER,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  SECRET,
};
