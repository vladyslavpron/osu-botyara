const Jimp = require("jimp");
const moment = require("moment");

async function renderConf(beatmap, scores) {
  let image = new Jimp(912, 250 + scores.length * 20, "#000000");

  let template = await Jimp.read(`${__dirname}/templateImages/conf.png`);
  image.blit(template, 0, 0);
  const background = await Jimp.read(beatmap.beatmapset.covers["cover@2x"]);
  //   const bgmask = await Jimp.read(`${__dirname}/templateImages/bgmask.png`);

  background.resize(902, 205).fade(0.3);
  // .mask(bgmask, 0, 0);
  image.blit(background, 5, 5);

  const scoresImg = await printScores(scores);
  image.blit(scoresImg, 0, 249);

  await image.writeAsync("conf1.png");
  return "conf1.png";
}

async function printMapInfo(beatmap) {}

async function printScores(scores) {
  //   let image = await Jimp.read(`${__dirname}/templateImages/conf.png`);
  let image = new Jimp(912, scores.length * 20, "#000000");

  const font = await Jimp.loadFont(`${__dirname}/fonts/conf/scoresStats.fnt`);
  const font300 = await Jimp.loadFont(`${__dirname}/fonts/conf/for300.fnt`);
  const font100 = await Jimp.loadFont(`${__dirname}/fonts/conf/for100.fnt`);
  const font50 = await Jimp.loadFont(`${__dirname}/fonts/conf/for50.fnt`);
  const fontMiss = await Jimp.loadFont(`${__dirname}/fonts/conf/forMiss.fnt`);

  image.resize(912, scores.length * 20);

  const maxCombo = 9999;

  scores.forEach((score, i) => {
    // console.log(score);
    const y = 20 * i;
    print(font, 25, y, `#${i + 1}`, 37, 12);
    print(font, 77, y, `#${score.position.toLocaleString("en-US")}`, 46, 12);
    print(font, 145, y, score.user.username, 100, 12);
    print(font, 255, y, score.score.toLocaleString("en-US"), 90, 12);
    print(font, 350, y, `${score.pp.toFixed()}pp`, 60, 12);
    print(font, 420, y, `${score.max_combo}x/${maxCombo}x`, 75, 12);
    print(font, 500, y, `${score.mods.join("")}`, 100, 12);
    print(font, 620, y, `${(score.accuracy * 100).toFixed(2)}%`, 63, 12);
    print(font300, 697, y, score.statistics.count_300, 26, 12);
    print(font100, 734, y, score.statistics.count_100, 26, 12);
    print(font50, 769, y, score.statistics.count_50, 22, 12);
    print(fontMiss, 795, y, score.statistics.count_miss, 22, 12);
    print(font, 825, y, moment(score.created_at).format("DD/MM/YYYY"), 70, 12);
  });

  function print(font, x, y, text, maxx, maxy) {
    image.print(
      font,
      x,
      y,
      {
        text: `${text}`,
        ...centerAlignment,
      },
      maxx,
      maxy
    );
  }

  return image;
}

const centerAlignment = {
  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
};

module.exports = renderConf;
