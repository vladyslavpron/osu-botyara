const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config({ path: "../config.env" });

(async function getUserScore(user, mapId) {
  return await axios
    .get(`https://osu.ppy.sh/api/v2/beatmaps/lookup?id=1971099`, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`,
      },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.response));
})();

// module.exports = getUserScore;
