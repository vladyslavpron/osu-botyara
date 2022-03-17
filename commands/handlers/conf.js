const axios = require("axios");
const Chat = require("../../models/chatModel");
const renderConf = require("../../renderImage/renderConf");
const getBeatmap = require("../../utils/getBeatmap");
const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");
const getUserScore = require("./../../utils/getUserScore");

async function conf(ctx) {
  // TODO: must show scores only for this conversation

  // const mapId=

  let mods;
  const userId = ctx.message.from.id;
  const command = ctx.update.message.text.split(" ");

  const text =
    ctx.update.message?.reply_to_message?.caption ||
    ctx.update.message?.reply_to_message?.text;
  const mapId = text?.slice(text.lastIndexOf("/") + 1, text.length);
  if (!mapId || !isFinite(mapId)) return ctx.reply("Beatmap url not found");

  if (command[1] && command[1].indexOf("+") !== -1)
    mods =
      command[1]
        .slice(1)
        .toUpperCase()
        .match(/.{1,2}/g) || [];

  console.log(ctx.update.message.chat.id);

  const users = (
    await Chat.find({
      chatId: ctx.update.message.chat.id,
    }).populate("users", {
      telegramId: 1,
      osuId: 1,
    })
  )[0].users;

  console.log(users);

  const scoresRequests = users.map((user) =>
    getUserScore(user.osuId, mapId, mods)
  );
  const scores = (await Promise.allSettled(scoresRequests)).map((el) => {
    el.value.score.position = el.value.position;
    return el.value.score;
  });
  if (!scores.length) return ctx.reply("No scores found for this beatmap");

  const beatmap = await getBeatmap(scores[0].beatmap.id);
  // console.log(beatmap);

  // console.log(scores);

  const confImg = await renderConf(beatmap, scores);

  // ctx.reply("/conf handled");
  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${confImg}` }
    // { caption: `Beatmap url: ${map.url}` }
  );
}

module.exports = conf;
