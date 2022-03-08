const { Telegraf } = require("telegraf");
const User = require("../models/userModel");
const reg = require("./handlers/reg");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("stats", async (ctx) => {
  // ctx.telegram.sendMessage(ctx.message.chat.id, "You just used a command!");
  console.log(ctx.message);
  //   User.create({ telegramId: 1 });
  await User.findOneAndUpdate({ telegramId: 1 }, { countryRank: 10 });
  ctx.reply("You just used a command!");
});

bot.command("reg", (ctx) => reg(ctx));

bot.on("text", (ctx) => {
  console.log(ctx);
  ctx.reply(`Helloooo`);
});

bot.launch();
