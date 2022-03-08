const dotenv = require("dotenv");
const mongoose = require("mongoose");
const axios = require("axios");
const Jimp = require("jimp");
const me = 12703752;

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB successfully connected!"))
  .catch((err) => console.log(err));
//

const commands = require("./commands/commands");
