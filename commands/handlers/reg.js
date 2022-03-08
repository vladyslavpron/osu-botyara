async function reg(ctx) {
  const userId = ctx.message.from.id;
  console.log(ctx.message.text.indexOf(" "));
  if (ctx.message.text.indexOf(" ") === -1)
    return ctx.reply("Correct usage: /reg nickname");
  const osuNickname = ctx.message.text.split(" ");
  console.log(userId, osuNickname);
  ctx.reply("/reg answer");
}

module.exports = reg;
