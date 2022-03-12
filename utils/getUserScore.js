const axios = require("axios");

async function getUserScore(user, mapId) {
  return await axios
    .get(`https://osu.ppy.sh/api/v2/beatmaps/${mapId}/scores/users/${user}`, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err.response));
}
module.exports = getUserScore;
