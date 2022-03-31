const renderTop = require("../../renderImage/renderTop");
const axios = require("axios");
const User = require("./../../models/userModel");
const getUser = require("./../../utils/getUser");
const getBeatmap = require("../../utils/getBeatmap");

async function top(ctx) {
 

  let mods, osuId, offset;
  const userId = ctx.update.message.from.id;
  const command = ctx.update.message.text.split(" ").slice(1);

  if (isFinite(command[0])) {
    offset = command[0];
    command.shift();
  }

  if (command.length && command[command.length - 1].indexOf("+") !== -1) {
    mods = (
      command[command.length - 1]
        .slice(1)
        .toUpperCase()
        .match(/.{1,2}/g) || []
    )
      .sort()
      .join("");
    command.pop();
  }

  // console.log(mods, mods.length);

  const username = command.join(" ");
  // TODO: RENDER TOP 5 SCORES
  // TODO: RENDER LIKE SCORE IF OFFSET DEFINED
  // TODO: IF MODS, THEN LIMIT 100 AND FILTER FOR MODS
  // TODO: TEST COMMANDS IF USERNAME CONTAINS NUMBERS
  if (username) osuId = username;
  else osuId = (await User.findOne({ telegramId: userId })).osuId;

  const user = await getUser(osuId);

  if (!user) return ctx.reply("User not found");
  osuId = user.id;

  // console.log(offset);

  let topScores = await getTopScores(
    osuId,
    mods ? 0 : offset ? offset : 0,
    mods ? 100 : offset ? 1 : 5
  );
  // console.log(topScores.length);

  if (mods) {
    let count = 0;
    let max = offset || 5;
    topScores = topScores.filter((score) => {
      // console.log(score.mods.sort().join(""), score.mods.length, count);
      if (!score.mods.length) score.mods.push("NM");
      if (
        count < max &&
        score.mods.length * 2 === mods.length &&
        score.mods.sort().join("") === mods
      ) {
        count++;
        return true;
      }
      return false;
    });
  }

  // console.log(topScores.length);

  if (!topScores || !topScores.length || topScores.length < offset)
    return ctx.reply(
      `Can't find${mods ? ` +${mods}` : ""} best${
        offset ? ` ${offset}` : ""
      } score${offset ? "" : "s"}`
    );

  if (offset) topScores = [topScores[offset - 1]];
  else topScores = topScores.slice(0, 5);

  // console.log(topScores.length);
  // console.log(topScores);

  const scores = (
    await Promise.allSettled(
      topScores.map(async (score) => {
        if (score.perfect) {
          score.beatmap.max_combo = score.max_combo;
        } else {
          score.beatmap.max_combo = (
            await getBeatmap(score.beatmap.id)
          ).max_combo;
        }
        return score;
      })
    )
  ).map((el) => el.value);

  const topImage = await renderTop(user, scores, mods, offset);

  // console.log(osuId, username, mods);
  // ctx.reply("not implemented yet");
  return ctx.replyWithPhoto(
    { source: `${__dirname}/../../top1.png` },
    { caption: `Profile url: https://osu.ppy.sh/users/${osuId}/osu` }
  );
}

module.exports = top;

async function getTopScores(user, offset = 0, limit = 5) {
  return await axios
    .get(
      `https://osu.ppy.sh/api/v2/users/${user}/scores/best?mode=osu&offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => console.log(err.response));
}
