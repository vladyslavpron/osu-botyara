const axios = require("axios");

async function getUser(user) {
  return await axios
    .get(`https://osu.ppy.sh/api/v2/users/${user}`, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err.res.statusMessage));
}

module.exports = getUser;
