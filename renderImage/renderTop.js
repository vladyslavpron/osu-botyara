const Jimp = require("jimp");
const renderStats = require("./renderStats");
const moment = require("moment");

async function renderTop(statsRenderData, scores) {
  console.log(scores);
  const nameFont = await Jimp.loadFont(`${__dirname}/fonts/top/forName.fnt`);
  const ppFont = await Jimp.loadFont(`${__dirname}/fonts/top/forPP.fnt`);
  const mediumFont = await Jimp.loadFont(`${__dirname}/fonts/top/medium.fnt`);
  const for300 = await Jimp.loadFont(`${__dirname}/fonts/top/for300.fnt`);
  const for100 = await Jimp.loadFont(`${__dirname}/fonts/top/for100.fnt`);
  const for50 = await Jimp.loadFont(`${__dirname}/fonts/top/for50.fnt`);
  const forMiss = await Jimp.loadFont(`${__dirname}/fonts/top/forMiss.fnt`);

  //   console.log(scores[0].beatmapset.covers);
  const image = new Jimp(1024, 0 + 30 + scores.length * 155, "#000000");

  //   const statsImage = await renderStats(statsRenderData);
  //   statsImage.resize(382, 250);
  //   image.blit(statsImage, 65, 0);
  //   const banner = await Jimp.read(`${__dirname}/templateImages/topBanner.png`);
  //   image.blit(banner, 0, 240);

  const cardsPromises = scores.map((score, i) =>
    printScore(5, 150 * i + 5 * (i + 1), score)
  );
  await Promise.all(cardsPromises);

  await image.writeAsync("top1.png");

  return image;

  async function printScore(x, y, score) {
    // backround
    const bg = await Jimp.read(score.beatmapset.covers.list);
    image.blit(bg, x, y);

    // map name
    image.print(
      nameFont,
      x + 160,
      y,
      `${score.beatmapset.artist} - ${score.beatmapset.title} (${score.beatmapset.creator}) [${score.beatmap.version}]`,
      512,
      52
    );

    // mods
    if (score.mods.length)
      for (let i = 0; i < score.mods.length; i++) {
        const modImg = await Jimp.read(
          `${__dirname}/icons/mods/${score.mods[i]}.png`
        );

        image.blit(modImg, x + 160 + i * 46, y + 108);
      }

    // pp
    image.print(ppFont, x + 160 + 384, y + 100, `${score.pp.toFixed()} PP`);

    //   accuracy
    image.print(
      mediumFont,
      x + 160 + 512 + 64 + 150,
      y + 5,
      `${(score.accuracy * 100).toFixed(2)}%`
    );

    image.print(mediumFont, x + 160 + 512 + 64 + 150, y + 30, `|     |     |`);

    // 300
    image.print(
      for300,
      x + 845,
      y + 35,
      {
        text: `${score.statistics.count_300}`,
        ...alignment,
      },
      40,
      18
    );
    // 100
    image.print(
      for100,
      x + 895,
      y + 35,
      {
        text: `${score.statistics.count_100}`,
        ...alignment,
      },
      35,
      18
    );
    // 50
    image.print(
      for50,
      x + 935,
      y + 35,
      {
        text: `${score.statistics.count_50}`,
        ...alignment,
      },
      35,
      18
    );

    // miss
    image.print(
      forMiss,
      x + 975,
      y + 35,
      {
        text: `${score.statistics.count_miss}`,
        ...alignment,
      },
      35,
      18
    );

    // rank
    const rankImg = await Jimp.read(
      `${__dirname}/icons/rankIcons/${score.rank}.png`
    );
    rankImg.resize(64, 32);
    image.blit(rankImg, x + 160 + 512, y + 5);

    // date
    image.print(
      mediumFont,
      x + 1024 - 165,
      y + 105,
      `${moment(score.created_at).fromNow()}`
    );
  }
}

module.exports = renderTop;

const alignment = {
  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
};
