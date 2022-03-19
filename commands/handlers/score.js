const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

const getUserScore = require("./../../utils/getUserScore");
const getBeatmap = require("../../utils/getBeatmap");

async function score(ctx) {
  console.log(
    `user ${ctx.message.from.id} from chat ${ctx.message.chat.id} asking /score`
  );
  let osuId, username, mods;
  const userId = ctx.message.from.id;

  const command = ctx.update.message.text.split(" ");

  if (command[command.length - 1].indexOf("+") !== -1) {
    mods =
      command[command.length - 1]
        .slice(1)
        .toUpperCase()
        .match(/.{1,2}/g) || [];
    command.pop();
  }
  command.shift();

  if (command.length) username = command.join(" ");

  // console.log(command, mods, username);

  const text =
    ctx.update.message?.reply_to_message?.caption ||
    ctx.update.message?.reply_to_message?.text;

  const mapId = text?.slice(text.lastIndexOf("/") + 1, text.length);

  if (!mapId || !isFinite(mapId)) return ctx.reply("Beatmap url not found");

  if (!username) osuId = (await User.findOne({ telegramId: userId })).osuId;
  else osuId = username;

  if (!osuId) return ctx.reply("User not found");
  const userProfile = await getUser(osuId);
  osuId = userProfile?.id;
  if (!osuId) return ctx.reply("User not found");

  // console.log(mapId);
  const score = await getUserScore(osuId, mapId, mods);
  if (!score)
    return ctx.reply(
      `Can't find user's ${
        mods ? `+${mods.join("")}` : ""
      } score on this beatmap`
    );
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
