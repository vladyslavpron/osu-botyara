const axios = require("axios");
const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

async function last(ctx) {
  let osuId, offset, username;
  const userId = ctx.message.from.id;

  const command = ctx.message.text.split(" ");
  if (isFinite(command[1])) {
    offset = parseInt(command[1]);
    command.splice(0, 2);
    username = command.join(" ");
  } else username = command.slice(1, command.length).join(" ");

  if (!username) osuId = (await User.findOne({ telegramId: userId })).osuId;
  else osuId = username;

  if (!osuId) return ctx.reply("User not found");
  const userProfile = await getUser(osuId);
  osuId = userProfile?.id;
  if (!osuId) return ctx.reply("User not found");

  const lastScore = await getLastScore(osuId, offset);
  if (!lastScore.length)
    return ctx.reply("Can't find recent plays for this user");

  // console.log(lastScore);
  const { user, play, map } = buildObjUserPlayMap(lastScore[0], userProfile);

  // console.log(user, map, play);

  const scoreImage = await renderScore(user, map, play);

  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../${scoreImage}` },
    { caption: `Beatmap url: ${map.url}` }
  );
}

module.exports = last;

async function getLastScore(user, offset) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/recent?include_fails=1&limit=1&offset=${offset}&mode=osu`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.response));
}
