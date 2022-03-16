const axios = require("axios");

async function getUserScore(user, mapId, mods) {
  const modsStr = mods && `?mods[]=${mods.join("&mods[]=")}`;

  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/beatmaps/${mapId}/scores/users/${user}${modsStr}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.response.status, err.response.statusText));
}
module.exports = getUserScore;
