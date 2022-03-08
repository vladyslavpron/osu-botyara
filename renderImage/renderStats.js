const Jimp = require("jimp");

async function renderStats(user) {
  const image = await Jimp.read(`${__dirname}/templateImages/stats.png`);
  const avatar = await Jimp.read(user.data.avatarUrl);
  image.blit(avatar, 10, 10);
  await image.writeAsync("stats1.png");
  return "stats1.png";
}

module.exports = renderStats;
