const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");

async function top(ctx) {
  let mods, osuId;
  const userId = ctx.update.message.from.id;
  const command = ctx.update.message.text.split(" ").slice(1);

  if (command.length && command[command.length - 1].indexOf("+") !== -1) {
    mods = command[command.length - 1].slice(1);
    command.pop();
  }

  const username = command.join(" ");
  if (username) osuId = username;
  else osuId = (await User.findOne({ telegramId: userId })).osuId;
  // console.log(osuId, username, mods);
  ctx.reply("your top scores");
}

module.exports = top;

async function getTopScores(user, mapId) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/best?mode=osu&offset=90&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => {
      console.log(res.data, res.data.length);
    })
    .catch((err) => console.log(err.response));
}
