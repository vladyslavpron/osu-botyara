const axios = require("axios");
const Chat = require("../../models/chatModel");
const renderConf = require("../../renderImage/renderConf");
const getBeatmap = require("../../utils/getBeatmap");
const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");
const getUserScore = require("./../../utils/getUserScore");

async function conf(ctx, buttonCallback) {
  let mods, mapId, chatId;
  if (!buttonCallback) {
    const userId = ctx.message.from.id;
    const command = ctx.update.message.text.split(" ");

    const text =
      ctx.update.message?.reply_to_message?.caption ||
      ctx.update.message?.reply_to_message?.text;
    mapId = text?.slice(text.lastIndexOf("/") + 1, text.length);
    if (!mapId || !isFinite(mapId)) return ctx.reply("Beatmap url not found");

    if (command[1] && command[1].indexOf("+") !== -1)
      mods =
        command[1]
          .slice(1)
          .toUpperCase()
          .match(/.{1,2}/g) || [];
    chatId = ctx.update.message.chat.id;
  } else {
    mapId = buttonCallback.mapId;
    mods = buttonCallback.mods;
    chatId = ctx.update.callback_query.message.chat.id;
  }
  console.log(chatId);
  const users = (
    await Chat.find({
      chatId,
    }).populate("users", {
      telegramId: 1,
      osuId: 1,
    })
  )[0].users;

  console.log(users);

  const scoresRequests = users
    .filter((user) => user.osuId)
    .map((user) => getUserScore(user.osuId, mapId, mods));
  const scoresResponses = (await Promise.allSettled(scoresRequests)).filter(
    (el) => el.value
  );
  console.log(scoresRequests);

  console.log(scoresResponses);

  if (!scoresResponses.length)
    return ctx.reply("No scores found for this beatmap");
  const scores = scoresResponses.map((el) => {
    // console.log(el);
    if (!el.value) return false;
    el.value.score.position = el.value.position;

    return el.value.score;
  });

  // console.log(scores);

  if (scores.length > 1) scores.sort((a, b) => b.score - a.score);

  const beatmap = await getBeatmap(scores[0].beatmap.id);
  // console.log(beatmap);

  const confImg = await renderConf(beatmap, scores);

  // ctx.reply("/conf handled");
  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${confImg}` },
    { caption: `Beatmap url: ${beatmap.url}` }
  );
}

module.exports = conf;
