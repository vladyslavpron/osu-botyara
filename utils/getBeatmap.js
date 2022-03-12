const axios = require("axios");

async function getBeatmap(id) {
  return await axios
    .get(`https://osu.ppy.sh/api/v2/beatmaps/lookup?id=${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err.response.res));
}

module.exports = getBeatmap;
