const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");
const renderStats = require("../../renderImage/renderStats");

async function stats(ctx) {
  let user, osuId;
  const userId = ctx.message.from.id;

  if (ctx.message.text.indexOf(" ") === -1) {
    user = await User.findOne({ telegramId: userId });
    osuId = user.osuId;
  } else {
    user = ctx.message.text.split(" ").slice(1).join(" ");
    osuId = user;
  }

  if (!user) return ctx.reply("Specify or connect account");

  const userNew = await getUser(osuId);

  if (!userNew) return ctx.reply("User not found");

  // console.log(userNew);
  const statsRenderData = {
    data: {
      nickname: userNew.username,
      osuId: userNew.id,
      globalRank: userNew.statistics.global_rank,
      countryRank: userNew.statistics.country_rank,
      performancePoints: userNew.statistics.pp.toFixed(),
      playCount: userNew.statistics.play_count,
      accuracy: userNew.statistics.hit_accuracy.toFixed(2),
      playTime: userNew.statistics.play_time,
      grades: userNew.statistics.grade_counts,
      avatarUrl: userNew.avatar_url,
      country: userNew.country,
      supporter: userNew.is_supporter,
    },
    difference: {},
  };
  const statsImage = await renderStats(statsRenderData);

  return ctx.replyWithPhoto({ source: `${__dirname}/../../stats1.png` });
}

module.exports = stats;
