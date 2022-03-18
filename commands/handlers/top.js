const renderTop = require("../../renderImage/renderTop");
const axios = require("axios");
const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");

async function top(ctx) {
  let mods, osuId, offset;
  const userId = ctx.update.message.from.id;
  const command = ctx.update.message.text.split(" ").slice(1);

  if (isFinite(command[0])) {
    offset = command[0];
    command.shift();
  }

  if (command.length && command[command.length - 1].indexOf("+") !== -1) {
    mods = command[command.length - 1].slice(1);
    command.pop();
  }

  const username = command.join(" ");
  // TODO: RENDER TOP 5 SCORES
  // TODO: RENDER LIKE SCORE IF OFFSET DEFINED
  // TODO: IF MODS, THEN LIMIT 100 AND FILTER FOR MODS
  // TODO: TEST COMMANDS IF USERNAME CONTAINS NUMBERS
  if (username) osuId = username;
  else osuId = (await User.findOne({ telegramId: userId })).osuId;

  const user = await getUser(osuId);

  if (!user) return ctx.reply("User not found");
  osuId = user.id;

  const scores = await getTopScores(osuId);

  const statsRenderData = {
    data: {
      nickname: user.username,
      osuId: user.id,
      globalRank: user.statistics.global_rank,
      countryRank: user.statistics.country_rank,
      performancePoints: user.statistics.pp.toFixed(),
      playCount: user.statistics.play_count,
      accuracy: user.statistics.hit_accuracy.toFixed(2),
      playTime: user.statistics.play_time,
      grades: user.statistics.grade_counts,
      avatarUrl: user.avatar_url,
      country: user.country,
      supporter: user.is_supporter,
    },
  };

  const topImage = await renderTop(statsRenderData, scores);

  // console.log(osuId, username, mods);
  // ctx.reply("not implemented yet");
  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../top1.png` },
    { caption: `Profile url: https://osu.ppy.sh/users/${osuId}/osu` }
  );
}

module.exports = top;

async function getTopScores(user) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/best?mode=osu&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.response));
}
