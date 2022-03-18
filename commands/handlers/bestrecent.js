const axios = require("axios");

const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

const getUserScore = require("./../../utils/getUserScore");
const getBeatmap = require("../../utils/getBeatmap");

async function bestrecent(ctx) {
  //   const start = Date.now();

  let username;
  const userId = ctx.message.from.id;
  const command = ctx.message.text.split(" ");
  if (command.length > 1) {
    username = command.slice(1, command.length).join(" ");
  } else username = (await User.findOne({ telegramId: userId })).osuId;
  if (!username) return ctx.reply("Specify or connect account");

  const userProfile = await getUser(username);

  if (!userProfile) return ctx.reply("User not found");

  // get recent scores and get rid of unranked
  const recentScores = (await getRecentScores(userProfile.id)).filter(
    (score) => score.beatmapset.status === "ranked"
  );
  //   console.log(recentScores);

  if (!recentScores.length)
    return ctx.reply("Can't find recent ranked plays for this user");

  const bestRecentScore = recentScores.reduce((prev, current) =>
    prev.pp > current.pp ? prev : current
  );

  //   console.log(bestRecentScore);

  const { user, play, map } = buildObjUserPlayMap(bestRecentScore, userProfile);

  // console.log(user, map, play);

  const scoreImage = await renderScore(user, map, play);

  //   return ctx.reply("/bestrecent not implemented yet");
  //   console.log(Date.now() - start);
  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${scoreImage}` },
    { caption: `Beatmap url: ${map.url}` }
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
