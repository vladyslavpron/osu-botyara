const { Markup } = require("telegraf");
const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");
const renderStats = require("../../renderImage/renderStats");

async function stats(ctx, buttonCallback) {
  let user, osuId;

  if (!buttonCallback) {
    const userId = ctx.message.from.id;

    // if()

    if (ctx.message.text.indexOf(" ") === -1) {
      user = await User.findOne({ telegramId: userId });
      osuId = user.osuId;
    } else {
      user = ctx.message.text.split(" ").slice(1).join(" ");
      osuId = user;
    }

    if (!user) return ctx.reply("Specify or connect account");
  } else {
    osuId = buttonCallback.osuId;
  }

  const userNew = await getUser(osuId);
  osuId = userNew.id;
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

  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../stats1.png` },
    {
      caption: `Profile url: https://osu.ppy.sh/users/${osuId}/osu`,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        Markup.button.callback("Top scores", `top ${osuId}`),
        ,
        Markup.button.callback("Last score", `last ${osuId}`),
        Markup.button.callback("Best recent score", `bestrecent ${osuId}`),
      ]),
    }
  );
}

module.exports = stats;
