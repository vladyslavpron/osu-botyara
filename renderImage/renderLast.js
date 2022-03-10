const Jimp = require("jimp");

async function renderLast(user, map, play) {
  let image = await Jimp.read(`${__dirname}/templateImages/last.png`);
  const avatar = await Jimp.read(user.avatarUrl);
  avatar.resize(190, 200);
  image.blit(avatar, 0, 0);
  const background = await Jimp.read(map.covers.cover);
  background.resize(578, 200).fade(0.4);
  // .color([{ apply: "darken", params: [33] }]);
  image.blit(background, 190, 0);

  image = await printOnBackground(image, map);
  image = await printPlayStats(image, map, play);

  await image.writeAsync("last1.png");
  return "last1.png";
}

module.exports = renderLast;

async function printOnBackground(image, map) {
  const font = await Jimp.loadFont(`${__dirname}/fonts/lastDefault.fnt`);

  // load icons
  const lengthIcon = await Jimp.read(
    `${__dirname}/icons/mapStats/total_length.png`
  );
  const bpmIcon = await Jimp.read(`${__dirname}/icons/mapStats/bpm.png`);

  lengthIcon.resize(32, 32);
  bpmIcon.resize(32, 32);

  image.blit(lengthIcon, 570, 165);
  image.blit(bpmIcon, 650, 165);

  // print duration and bpm values
  const min = Math.floor(map.duration / 60);
  const sec = map.duration - min * 60;
  const duration = `${min}:${sec < 10 ? 0 : ""}${sec}`;
  image.print(font, 605, 170, duration);
  image.print(font, 685, 170, `${map.bpm.toFixed(1)}bpm`);

  return image;
}

async function printPlayStats(image, map, play) {
  const bigFont = await Jimp.loadFont(`${__dirname}/fonts/bigLast.fnt`);
  const mediumFont = await Jimp.loadFont(`${__dirname}/fonts/mediumLast.fnt`);
  const smallFont = await Jimp.loadFont(`${__dirname}/fonts/default.fnt`);

  // print rank
  const rank = await Jimp.read(`${__dirname}/icons/rankIcons/${play.rank}.png`);
  rank.resize(48, 24);
  image.blit(rank, 60, 250);

  // accuracy
  image.print(bigFont, 555, 240, `${(play.accuracy * 100).toFixed(2)}%`);

  // score
  image.print(smallFont, 60, 335, toLocale(play.score));

  // combo
  image.print(bigFont, 180, 335, `${play.combo}x/999x`);

  // completion
  const completion = (
    map.objects /
    (play.count50 + play.count100 + play.count300 + play.countMiss)
  ).toFixed(2);
  image.print(mediumFont, 75, 425, `${completion}%`);

  // mods
  // console.log(play.mods);
  for (let i = 0; i < play.mods.length; i++) {
    const modImg = await Jimp.read(
      `${__dirname}/icons/mods/${play.mods[i]}.png`
    );
    let x = 190 + 45 * i;
    let y = 245;
    if (i > 2) {
      x = 190 + 45 * (i - 3);
      y = 280;
    }
    image.blit(modImg, x, y);
  }

  return image;
}

const alignment = {
  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
};

const toLocale = (data) => data.toLocaleString("en-US");
