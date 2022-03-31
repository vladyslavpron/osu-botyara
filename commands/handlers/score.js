const { Markup } = require("telegraf");
const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

const getUserScore = require("./../../utils/getUserScore");
const getBeatmap = require("../../utils/getBeatmap");

async function score(ctx, buttonCallback) {
  try {
    let osuId, username, mods, mapId;

    if (!buttonCallback) {
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

      mapId = text?.slice(text.lastIndexOf("/") + 1, text.length);

      if (!mapId || !isFinite(mapId)) return ctx.reply("Beatmap url not found");

      if (!username) osuId = (await User.findOne({ telegramId: userId })).osuId;
      else osuId = username;

      if (!osuId) return ctx.reply("User not found");
    } else {
      osuId = buttonCallback.osuId;
      mapId = buttonCallback.beatmap;
      mods = buttonCallback.mods;
    }
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
    if (!score.score.mods.length) score.score.mods.push("NM");
    // console.log(score.score.mods);

    return ctx.replyWithPhoto(
      { source: `${__dirname}/../../${scoreImage}` },
      {
        caption: `Beatmap url: ${map.url}`,
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("My score", `score ${osuId} ${mapId}`),
            Markup.button.callback(
              `My score +${score.score.mods.join("")}`,
              `score ${osuId} ${mapId} ${score.score.mods}`
            ),
          ],
          [
            Markup.button.callback("Chat top", `conf ${osuId} ${mapId}`),
            Markup.button.callback(
              `Chat top +${score.score.mods.join("")}`,
              `conf ${osuId} ${mapId} ${score.score.mods}`
            ),
          ],
        ]),
      }
    );
  } catch (err) {
    console.log(err);
    return ctx.reply("Something went wrong");
  }
}
module.exports = score;
