const Chat = require("../../models/chatModel");
const User = require("./../../models/userModel");

async function unreg(ctx) {
  const userId = ctx.message.from.id;
  const user = await User.findOne({ telegramId: userId });
  if (!user.osuId) return ctx.reply("You haven't connected account yet");
  await User.findOneAndUpdate({ telegramId: userId }, { osuId: undefined });

  return ctx.reply(`Successfully deleted your account`);
}

module.exports = unreg;
