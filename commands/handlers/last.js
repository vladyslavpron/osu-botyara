const axios = require("axios");
const getUser = require("./../../utils/getUser");
const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");

async function last(ctx) {
  const start = Date.now();

  let osuId;
  const userId = ctx.message.from.id;

  if (ctx.message.text.indexOf(" ") === -1)
    osuId = (await User.findOne({ telegramId: userId })).osuId;
  else osuId = ctx.message.text.split(" ").slice(1).join(" ");

  if (!osuId) return ctx.reply("User not found");
  const userProfile = await getUser(osuId);
  osuId = userProfile?.id;
  if (!osuId) return ctx.reply("User not found");

  const lastScore = await getLastScore(osuId);
  if (!lastScore.length)
    return ctx.reply("Can't find recent plays for this user");

  // console.log(lastScore);

  const user = {
    username: lastScore[0].user.username,
    avatarUrl: lastScore[0].user.avatar_url,
    performancePoints: userProfile.statistics.pp.toFixed(),
    countryCode: lastScore[0].user.country_code,
    globalRank: userProfile.statistics.global_rank,
    countryRank: userProfile.statistics.country_rank,
    supporter: lastScore[0].user.is_supporter,
  };
  const map = {
    id: lastScore[0].beatmap.id,
    status: lastScore[0].beatmap.status,
    url: lastScore[0].beatmap.url,
    cs: lastScore[0].beatmap.cs.toFixed(1),
    bpm: lastScore[0].beatmap.bpm,
    covers: lastScore[0].beatmapset.covers,
    duration: lastScore[0].beatmap.total_length,
    hp: lastScore[0].beatmap.drain.toFixed(1),
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

  const lastImage = await renderScore(user, map, play);

  console.log(Date.now() - start);

  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${lastImage}` },
    { caption: `Beatmap url: ${map.url}` }
  );
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
    .catch((err) => console.log(err.response));
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
