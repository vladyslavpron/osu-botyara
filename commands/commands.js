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
const bestrecent = require("./handlers/bestrecent");
const { brightness } = require("jimp");
const help = require("./handlers/help");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middlware

// delay between commands
bot.use(async (ctx, next) => {
  if (
    ctx.update.message?.entities?.[0].type === "bot_command" ||
    ctx.update.callback_query
  ) {
    // get user from db
    let user = await User.findOne({
      telegramId:
        ctx.update.message?.from.id || ctx.update.callback_query?.from.id,
    });
    if (!user) {
      user = await User.create({
        telegramId:
          ctx.update.message?.from.id || ctx.update.callback_query?.from.id,
      });
      await user.save();
    }

    if (Date.now() - Date.parse(user.lastInteractionDate) < 5000) {
      await user.updateOne({ lastInteractionDate: new Date() });
      return ctx.reply("You must wait at least 5 seconds before using command");
    }
    await user.updateOne({ lastInteractionDate: new Date() });
  }

  return next();
});

// logging middleware
bot.use(async (ctx, next) => {
  // console.log(ctx.update.message);
  // console.log(ctx.update.message.entities);

  if (ctx.update.message?.entities?.[0].type === "bot_command")
    console.log(
      `user ${ctx.message.from.id} from chat ${ctx.message.chat.id} asking ${ctx.message.text}`
    );
  return next();
});

// saving users into schema
bot.use(async (ctx, next) => {
  if (!ctx.update.message?.text) return next();

  let user = await User.findOne({ telegramId: ctx.update.message.from.id });
  if (!user)
    user = await User.create({ telegramId: ctx.update.message.from.id });

  await Chat.findOneAndUpdate(
    { chatId: ctx.update.message.chat.id },
    { $addToSet: { users: user } },
    { upsert: true }
  );

  return next();
});

bot.command("help", (ctx) => help(ctx));
bot.command("reg", (ctx) => reg(ctx));
bot.command("unreg", (ctx) => unreg(ctx));
bot.command("stats", (ctx) => stats(ctx));
bot.command("last", (ctx) => last(ctx));
bot.command("recent", (ctx) => last(ctx));
bot.command("c", (ctx) => score(ctx));
bot.command("score", (ctx) => score(ctx));
bot.command("top", (ctx) => top(ctx));
bot.command("conf", (ctx) => conf(ctx));
bot.command("bestrecent", (ctx) => bestrecent(ctx));

bot.action(/.+/, async (ctx) => {
  // console.log(ctx);
  // console.log(ctx.update.callback_query.message);
  // `${command} ${osuId} ${beatmap} ${mods}`
  const callback_data = ctx.update.callback_query.data.split(" ");
  const buttonCallback = {
    command: callback_data[0],
    osuId: callback_data[1],
    beatmap: callback_data[2],
    mods: callback_data[3] ? callback_data[3].split(",") : undefined,
  };

  // console.log(buttonCallback);

  console.log(
    `user ${ctx.update.callback_query.from.id} from chat ${ctx.update.callback_query.message.chat.id} uses button ${buttonCallback.command}`
  );

  if (buttonCallback.command === "stats") return stats(ctx, buttonCallback);
  if (buttonCallback.command === "last") return last(ctx, buttonCallback);
  if (buttonCallback.command === "top") return top(ctx, buttonCallback);
  if (buttonCallback.command === "score") return score(ctx, buttonCallback);
  if (buttonCallback.command === "conf") return conf(ctx, buttonCallback);
  if (buttonCallback.command === "bestrecent")
    return bestrecent(ctx, buttonCallback);

  return ctx.reply("Something went wrong with button");
});

// bot.on("text", (ctx) => {
//   ctx.reply(`Helloooo`);
// });

bot.launch();
