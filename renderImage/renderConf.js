const Jimp = require("jimp");
const moment = require("moment");

async function renderConf(beatmap, scores) {
  let image = new Jimp(912, 250 + scores.length * 20, "#000000");

  let template = await Jimp.read(`${__dirname}/templateImages/conf.png`);
  image.blit(template, 0, 0);

  const background = await Jimp.read(beatmap.beatmapset.covers["cover@2x"]);
  background.resize(902, 205).fade(0.3);
  image.blit(background, 5, 5);

  // console.log(beatmap);

  await printMapInfo(beatmap);

  const scoresImg = await printScores(scores, beatmap.max_combo);
  image.blit(scoresImg, 0, 249);

  await image.writeAsync("conf1.png");
  return "conf1.png";

  async function printMapInfo(beatmap) {
    const font = await Jimp.loadFont(`${__dirname}/fonts/lastDefault.fnt`);
    const fontForName = await Jimp.loadFont(
      `${__dirname}/fonts/mediumLast.fnt`
    );

    image.print(
      fontForName,
      20,
      5,
      {
        text: `${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title} (${beatmap.beatmapset.creator}) [${beatmap.version}]`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP,
      },
      862,
      50
    );

    // stats
    image.print(font, 200, 175, `CS: ${beatmap.cs}`);
    image.print(font, 275, 175, `AR: ${beatmap.ar}`);
    image.print(font, 350, 175, `OD: ${beatmap.accuracy}`);
    image.print(font, 425, 175, `HP: ${beatmap.drain}`);
    image.print(font, 500, 175, `SR: ${beatmap.difficulty_rating}`);

    // print duration and bpm values
    const min = Math.floor(beatmap.total_length / 60);
    const sec = beatmap.total_length - min * 60;
    const duration = `${min}:${sec < 10 ? 0 : ""}${sec}`;
    image.print(font, 575, 175, `DUR: ${duration}`);
    image.print(font, 650, 175, `BPM: ${+beatmap.bpm.toFixed(1)}`);
  }
}

async function printScores(scores, maxCombo) {
  //   let image = await Jimp.read(`${__dirname}/templateImages/conf.png`);
  let image = new Jimp(912, scores.length * 20, "#000000");

  const font = await Jimp.loadFont(`${__dirname}/fonts/conf/scoresStats.fnt`);
  const font300 = await Jimp.loadFont(`${__dirname}/fonts/conf/for300.fnt`);
  const font100 = await Jimp.loadFont(`${__dirname}/fonts/conf/for100.fnt`);
  const font50 = await Jimp.loadFont(`${__dirname}/fonts/conf/for50.fnt`);
  const fontMiss = await Jimp.loadFont(`${__dirname}/fonts/conf/forMiss.fnt`);

  image.resize(912, scores.length * 20);

  scores.forEach((score, i) => {
    // console.log(score);
    const y = 20 * i;
    print(font, 25, y, `#${i + 1}`, 37, 12);
    print(font, 77, y, `#${score.position.toLocaleString("en-US")}`, 46, 12);
    print(font, 145, y, score.user.username, 100, 12);
    print(font, 255, y, score.score.toLocaleString("en-US"), 90, 12);
    print(font, 355, y, `${score.pp.toFixed()}pp`, 45, 12);
    print(font, 420, y, `${score.max_combo}x/${maxCombo}x`, 75, 12);
    print(font, 510, y, `${score.mods.join("")}`, 85, 12);
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
