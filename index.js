const dotenv = require("dotenv");
const mongoose = require("mongoose");
const axios = require("axios");
const Jimp = require("jimp");

const me = 12703752;

dotenv.config({ path: "./config.env" });

(async function () {
  const user = await getUser();
  user.page = "";
  console.log(user);
  Jimp.read("profile.png").then((profile) => {
    Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then((font) => {
      profile.print(font, 100, 50, user.country_code);

      Jimp.read(user.avatar_url).then((avatar) => {
        profile.blit(avatar, 100, 200);
        profile.write("profile1.png");
      });
    });
  });
})();

async function auth() {
  axios
    .post("https://osu.ppy.sh/oauth/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

async function getUser() {
  return await axios
    .get("https://osu.ppy.sh/api/v2/users/11367222", {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}
