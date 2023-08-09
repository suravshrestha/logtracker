require("dotenv").config();

const PORT = process.env.PORT || 3000;

const SMTP_SERVER = process.env.SMTP_SERVER || "smtp.ethereal.email";
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI || "mongodb://localhost:27017/logtracker";

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
