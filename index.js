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

async function auth() {
  await axios
    .post("https://osu.ppy.sh/oauth/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    })
    .then((res) => {
      console.log("got new osu token");
      process.env.BEARER = res.data.access_token;
    })
    .catch((err) => console.log(err));
}
// get new bearer on start and every 22h
auth();
setInterval(auth, 1000 * 60 * 60 * 22);

const commands = require("./commands/commands");
