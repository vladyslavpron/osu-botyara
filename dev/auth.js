const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config({ path: "../config.env" });

(async function auth() {
  axios
    .post("https://osu.ppy.sh/oauth/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
})();
