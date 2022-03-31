const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");

async function reg(ctx) {
  if (ctx.message.text.indexOf(" ") === -1)
    return ctx.reply("Correct usage: /reg nickname");

  const userId = ctx.message.from.id;
  const osuNickname = ctx.message.text.split(" ")[1];
  const user = await getUser(osuNickname);

  if (!user) return ctx.reply(`User not found`);

  await User.findOneAndUpdate(
    { telegramId: userId },
    {
      osuId: user.id,
      // globalRank: user.statistics.global_rank,
      // countryRank: user.statistics.country_rank,
      // performancePoints: user.statistics.pp.toFixed(),
      // playCount: user.statistics.play_count,
      // accuracy: user.statistics.hit_accuracy.toFixed(2),
      // playTime: user.statistics.play_time,
      // grades: user.statistics.grade_counts,
    },
    { upsert: true }
  );

  return ctx.reply(`Successfully connected ${osuNickname}`);
}

module.exports = reg;
