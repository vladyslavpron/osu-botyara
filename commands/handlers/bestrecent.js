const axios = require("axios");
const { Markup } = require("telegraf");

const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

const getUserScore = require("./../../utils/getUserScore");
const getBeatmap = require("../../utils/getBeatmap");

async function bestrecent(ctx, buttonCallback) {
  //   const start = Date.now();

  let username;
  if (!buttonCallback) {
    const userId = ctx.message.from.id;
    const command = ctx.message.text.split(" ");
    if (command.length > 1) {
      username = command.slice(1, command.length).join(" ");
    } else username = (await User.findOne({ telegramId: userId })).osuId;
    if (!username) return ctx.reply("Specify or connect account");
  } else {
    username = buttonCallback.osuId;
  }
  const userProfile = await getUser(username);

  if (!userProfile) return ctx.reply("User not found");

  // get recent scores and get rid of unranked
  const recentScores = (await getRecentScores(userProfile.id)).filter(
    (score) => score.beatmapset.status === "ranked"
  );
  //   console.log(recentScores);

  if (!recentScores.length)
    return ctx.reply(
      `Can't find recent ranked plays for ${userProfile.username}`
    );

  const bestRecentScore = recentScores.reduce((prev, current) =>
    prev.pp > current.pp ? prev : current
  );

  console.log(bestRecentScore);

  const { user, play, map } = buildObjUserPlayMap(bestRecentScore, userProfile);

  // console.log(user, map, play);

  const scoreImage = await renderScore(user, map, play);
  if (!bestRecentScore.mods.length) bestRecentScore.mods.push("NM");
  console.log(bestRecentScore.mods);
  //   return ctx.reply("/bestrecent not implemented yet");
  //   console.log(Date.now() - start);
  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${scoreImage}` },
    {
      caption: `Beatmap url: ${map.url}`,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "My score",
            `score ${userProfile.user_id} ${bestRecentScore.beatmap.id}`
          ),
          Markup.button.callback(
            `My score +${bestRecentScore.mods.join("")}`,
            `score ${userProfile.user_id} ${bestRecentScore.beatmap.id} ${bestRecentScore.mods}`
          ),
        ],
        [
          Markup.button.callback(
            "Chat top",
            `conf ${userProfile.user_id} ${bestRecentScore.beatmap.id}`
          ),
          Markup.button.callback(
            `Chat top +${bestRecentScore.mods.join("")}`,
            `conf ${userProfile.user_id} ${bestRecentScore.beatmap.id} ${bestRecentScore.mods}`
          ),
        ],
      ]),
    }
  );
}

module.exports = bestrecent;

async function getRecentScores(user) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/recent?mode=osu&limit=500`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.response));
}
