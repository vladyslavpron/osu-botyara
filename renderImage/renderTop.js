const Jimp = require("jimp");
const renderStats = require("./renderStats");
const moment = require("moment");

async function renderTop(user, scores, mods) {
  // console.log(scores);
  // console.log(user);
  const usernameFont = await Jimp.loadFont(
    `${__dirname}/fonts/top/username.fnt`
  );
  const rankFont = await Jimp.loadFont(`${__dirname}/fonts/top/rank.fnt`);

  const bannerFont = await Jimp.loadFont(`${__dirname}/fonts/top/banner.fnt`);

  const nameFont = await Jimp.loadFont(`${__dirname}/fonts/top/forName.fnt`);
  const ppFont = await Jimp.loadFont(`${__dirname}/fonts/top/forPP.fnt`);
  const mediumFont = await Jimp.loadFont(`${__dirname}/fonts/top/medium.fnt`);
  const for300 = await Jimp.loadFont(`${__dirname}/fonts/top/for300.fnt`);
  const for100 = await Jimp.loadFont(`${__dirname}/fonts/top/for100.fnt`);
  const for50 = await Jimp.loadFont(`${__dirname}/fonts/top/for50.fnt`);
  const forMiss = await Jimp.loadFont(`${__dirname}/fonts/top/forMiss.fnt`);

  const image = new Jimp(1024, 240 + 40 + scores.length * 155 - 35, "#000000");

  // avatar
  const avatar = await Jimp.read(user.avatar_url);
  avatar.resize(200, 200);
  image.blit(avatar, 50, 0);

  // username
  image.print(usernameFont, 260, 77, `${user.username}`);
  // global rank
  image.print(rankFont, 582, 50, `Global: #${user.statistics.global_rank}`);
  // country rank
  image.print(
    rankFont,
    582,
    85,
    `${user.country_code}: #${user.statistics.country_rank}`
  );
  // pp
  image.print(
    rankFont,
    582,
    120,
    `Performance: ${user.statistics.pp.toFixed()}pp`
  );

  // banner
  const banner = await Jimp.read(`${__dirname}/templateImages/topBanner.png`);
  image.blit(banner, 0, 200);

  // smth like top 5 scores
  image.print(
    bannerFont,
    0,
    210,
    {
      text: `BEST ${scores.length}${mods ? ` +${mods}` : ""} PERFORMANCE: `,
      ...alignment,
    },
    1024,
    40
  );

  const cardBorder = new Jimp(1024, 5, "#2f2f2f");

  const cardsPromises = scores.map((score, i) =>
    printScore(5, 240 + 150 * i + 5 * (i + 1), score)
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
      x + 160 + 512 + 64 + 150 + 10,
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
    image.blit(rankImg, x + 160 + 512 + 15, y + 5);

    image.print(
      mediumFont,
      x + 670,
      y + 5,
      { text: `${score.max_combo}x/${score.beatmap.max_combo}x`, ...alignment },
      100,
      30
    );

    // date
    image.print(
      mediumFont,
      x + 1024 - 148,
      y + 115,
      `${moment(score.created_at).format("DD/MM/YYYY")}`
    );

    image.blit(cardBorder, 0, y + 150);
  }
}

module.exports = renderTop;

const alignment = {
  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
};
