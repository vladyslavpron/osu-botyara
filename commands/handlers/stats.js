const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");

async function stats(ctx) {
  let user;
  const userId = ctx.message.from.id;

  if (ctx.message.text.indexOf(" ") === -1)
    user = await User.findOne({ telegramId: userId });
  else user = ctx.message.text.split(" ")[1];

  console.log(user);

  return ctx.reply("hz,cheta");
}

module.exports = stats;
