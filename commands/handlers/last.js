const axios = require("axios");
const User = require("./../../models/userModel");
const renderScore = require("../../renderImage/renderScore");
const getUser = require("./../../utils/getUser");
const buildObjUserPlayMap = require("./../../utils/buildObjUserPlayMap");

async function last(ctx, buttonCallback) {
  let osuId, offset, username;
  if (!buttonCallback) {
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
  } else {
    osuId = buttonCallback.osuId;
  }
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
    {
      caption: `Beatmap url: ${map.url}`,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("My score", `score ${osuId} ${mapId}`),
          Markup.button.callback(
            `My score +${score.score.mods.join("")}`,
            `score ${osuId} ${mapId} ${score.score.mods}`
          ),
        ],
        [
          Markup.button.callback("Chat top", `conf ${osuId} ${mapId}`),
          Markup.button.callback(
            `Chat top +${score.score.mods.join("")}`,
            `conf ${osuId} ${mapId} ${score.score.mods}`
          ),
        ],
      ]),
    }
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
