const axios = require("axios");
const User = require("./../../models/userModel");
const renderLast = require("../../renderImage/renderLast");

async function last(ctx) {
  let osuId;
  const userId = ctx.message.from.id;

  if (ctx.message.text.indexOf(" ") === -1)
    osuId = (await User.findOne({ telegramId: userId })).osuId;
  else osuId = await getUserIdByName(ctx.message.text.split(" ")[1]);

  if (!osuId) return ctx.reply("Specify or connect account");

  const lastScore = await getLastScore(osuId);
  if (!lastScore) return ctx.reply("Can't find recent plays for this user");

  // console.log(lastScore);

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
    duration: lastScore[0].beatmap.total_length,
    objects:
      lastScore[0].beatmap.count_circles +
      lastScore[0].beatmap.count_sliders +
      lastScore[0].beatmap.count_spinners,
  };
  const play = {
    mods: lastScore[0].mods,
    score: lastScore[0].score,
    rank: lastScore[0].rank,
    combo: lastScore[0].max_combo,
    accuracy: lastScore[0].accuracy,
    date: lastScore[0].created_at,
    count300: lastScore[0].statistics.count_300,
    count100: lastScore[0].statistics.count_100,
    count50: lastScore[0].statistics.count_50,
    countMiss: lastScore[0].statistics.count_miss,
  };

  // console.log(user, map, play);
  const lastImage = await renderLast(user, map, play);

  return ctx.replyWithPhoto({ source: `${__dirname}/../../last1.png` });
}

module.exports = last;

async function getLastScore(user) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/recent?include_fails=1&limit=1&mode=osu`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.message));
}

async function getUserIdByName(user) {
  return await axios
    .get(`https://osu.ppy.sh/api/v2/users/${user}/osu`, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER}`,
      },
    })
    .then((res) => res.data.id)
    .catch((err) => console.log(err.message));
}
