require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PATH_UPLOAD_FILE: process.env.PATH_UPLOAD_FILE,
};
