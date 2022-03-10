const axios = require("axios");
const renderLast = require("../../renderImage/renderStats");

async function last(ctx) {
  const lastScore = await getLastScore(12703752);

  const user = {
    username: lastScore[0].user.username,
    avatarUrl: lastScore[0].user.avatar_url,
    countryCode: lastScore[0].user.country_code,
    supporter: lastScore[0].user.is_supporter,
  };
  const map = {
    id: lastScore[0].beatmap.id,
    status: lastScore[0].beatmap.status,
    cs: lastScore[0].beatmap.cs,
    bpm: lastScore[0].beatmap.bpm,
    covers: lastScore[0].beatmapset.covers,
    length: lastScore[0].beatmap.total_length,
  };
  const play = {
    mods: lastScore[0].mods,
    score: lastScore[0].score,
    rank: lastScore[0].rank,
    combo: lastScore[0].max_combo,
    date: lastScore[0].created_at,
  };
  console.log(user, map, play);
  const lastImage = await renderLast(user, map, play);

  return ctx.replyWithPhoto({ source: `${__dirname}/../../last1.png` });
}

module.exports = last;

async function getLastScore(user) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/recent?include_fails=1&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.response));
}
