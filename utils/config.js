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

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/logtracker";

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
