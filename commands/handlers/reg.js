const User = require(".../models/userModel");

async function reg(ctx) {
  const userId = ctx.message.from.id;
  console.log(ctx.message.text.indexOf(" "));
  if (ctx.message.text.indexOf(" ") === -1)
    return ctx.reply("Correct usage: /reg nickname");
  const osuNickname = ctx.message.text.split(" ")[1];

  const a = await User.findOneAndUpdate(
    { telegramId: userId },
    { osuId: 20 },
    { upsert: true }
  );
  console.log(userId, osuNickname);
  console.log(a);
  ctx.reply("/reg answer");
}

module.exports = reg;
