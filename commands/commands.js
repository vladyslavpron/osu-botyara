const { Telegraf } = require("telegraf");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const reg = require("./handlers/reg");
const stats = require("./handlers/stats");
const last = require("./handlers/last");
const score = require("./handlers/score");
const top = require("./handlers/top");
const conf = require("./handlers/conf");
const unreg = require("./handlers/unreg");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middlware
bot.use(async (ctx, next) => {
  if (!ctx.update.message?.text) return next();
  // console.log(ctx.update.message.from.id, ctx.update.message.chat.id);

  let user = await User.findOne({ telegramId: ctx.update.message.from.id });
  if (!user)
    user = await User.create({ telegramId: ctx.update.message.from.id });

  await Chat.findOneAndUpdate(
    { chatId: ctx.update.message.chat.id },
    { $addToSet: { users: user } },
    { upsert: true }
  );

  // console.log("middleware");
  return next();
});

bot.command("reg", (ctx) => reg(ctx));
bot.command("unreg", (ctx) => unreg(ctx));
bot.command("stats", (ctx) => stats(ctx));
bot.command("last", (ctx) => last(ctx));
bot.command("c", (ctx) => score(ctx));
bot.command("score", (ctx) => score(ctx));
bot.command("top", (ctx) => top(ctx));
bot.command("conf", (ctx) => conf(ctx));

bot.on("text", (ctx) => {
  ctx.reply(`Helloooo`);
});

bot.launch();
