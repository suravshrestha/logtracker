require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Admin credentials
const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Nodemailer settings
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

// JWT secret key
const SECRET = process.env.SECRET;

module.exports = {
  PORT,
  MONGODB_URI,

  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,

  SMTP_SERVER,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,

  SECRET,
};
