const { Telegraf } = require("telegraf");
const User = require("../models/userModel");
const reg = require("./handlers/reg");
const stats = require("./handlers/stats");
const last = require("./handlers/last");
const score = require("./handlers/score");
const top = require("./handlers/top");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("stats", (ctx) => stats(ctx));
bot.command("reg", (ctx) => reg(ctx));
bot.command("last", (ctx) => last(ctx));
bot.command("score", (ctx) => score(ctx));
bot.command("c", (ctx) => score(ctx));
bot.command("top", (ctx) => top(ctx));

bot.on("text", (ctx) => {
  ctx.reply(`Helloooo`);
});

bot.launch();
