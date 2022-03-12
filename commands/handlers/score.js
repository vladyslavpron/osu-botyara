const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

const getUserScore = require("./../../utils/getUserScore");
const getBeatmap = require("../../utils/getBeatmap");

async function score(ctx) {
  let osuId;
  const userId = ctx.message.from.id;

  const text =
    ctx.update.message?.reply_to_message?.caption ||
    ctx.update.message?.reply_to_message?.text ||
    ctx.update.message?.text;
  const mapId = text?.slice(text.lastIndexOf("/") + 1, text.length);

  if (!text || !mapId || !isFinite(mapId))
    return ctx.reply("Beatmap url not found");

  if (ctx.message.text.indexOf(" ") === -1)
    osuId = (await User.findOne({ telegramId: userId })).osuId;
  else osuId = ctx.message.text.split(" ").slice(1).join(" ");

  if (!osuId) return ctx.reply("User not found");
  const userProfile = await getUser(osuId);
  osuId = userProfile?.id;
  if (!osuId) return ctx.reply("User not found");

  // console.log(mapId);

  const score = await getUserScore(osuId, mapId);
  if (!score) return ctx.reply("Can't find user's score on this beatmap");
  const beatmap = await getBeatmap(mapId);
  score.score.beatmapset = beatmap.beatmapset;

  // console.log(score);
  const { user, play, map } = buildObjUserPlayMap(score.score, userProfile);

  const scoreImage = await renderScore(user, map, play);

  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${scoreImage}` },
    { caption: `Beatmap url: ${map.url}` }
  );
}
module.exports = score;
