const Jimp = require("jimp");

async function renderLast(user, map, play) {
  const image = await Jimp.read(`${__dirname}/templateImages/last.png`);
  const avatar = await Jimp.read(user.data.avatarUrl);
  image.blit(avatar, 0, 0);

  await image.writeAsync("last1.png");
  return "last1.png";
}

module.exports = renderLast;
