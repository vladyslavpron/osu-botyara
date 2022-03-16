const axios = require("axios");
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

  //   console.log(ctx, ctx.update.message.chat);

  //   const users = await User.find({});
  //   console.log(users);
  //   const scores = users.map((user) => getUserScore(user.osuId, mapId, mods));
  //   await Promise.allSettled(scores);

  //   console.log(scores);

  ctx.reply("/conf handled");
}

module.exports = conf;
