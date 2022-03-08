const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("stats", (ctx) => {
  // ctx.telegram.sendMessage(ctx.message.chat.id, "You just used a command!");
  ctx.reply("You just used a command!");
});

bot.on("text", (ctx) => {
  console.log(ctx);
  ctx.reply(`Helloooo`);
});

bot.launch();
