const Jimp = require("jimp");

async function renderStats(user) {
  console.log(user);

  let image = await Jimp.read(`${__dirname}/templateImages/stats.png`);

  // print avatar 10-273 10-266
  const avatar = await Jimp.read(user.data.avatarUrl);
  avatar.resize(263, 256);
  image.blit(avatar, 10, 10);

  // print flag 283-502 10-162
  const flag = await Jimp.read(
    `${__dirname}/icons/flags/${user.data.country.code}.png`
  );
  flag.resize(219, 152).color([{ apply: "darken", params: [20] }]);
  // .blur(1);

  image.blit(flag, 283, 10);

  if (user.data.supporter) image = await printSupporter(image);

  image = await printStats(user.data, image);
  await image.writeAsync("stats1.png");

  return "stats1.png";
}

module.exports = renderStats;

async function printStats(data, image) {
  const font = await Jimp.loadFont(`${__dirname}/fonts/default.fnt`);
  const nicknameFont = await Jimp.loadFont(`${__dirname}/fonts/bigForName.fnt`);
  const countryRankFont = await Jimp.loadFont(
    `${__dirname}/fonts/countryRank.fnt`
  );

  // console.log(data);

  // print on flag
  image.print(
    nicknameFont,
    283,
    40,
    {
      text: `${data.nickname}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
    },
    219,
    20
  );
  image.print(
    countryRankFont,
    283,
    110,
    {
      text: `${data.country.name} : #${data.countryRank}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
    },
    219,
    20
  );

  // print stuff
  image.print(font, 390, 181, `#${toLocale(data.globalRank)}`);
  image.print(font, 400, 206, `${toLocale(data.performancePoints)}pp`);
  image.print(font, 375, 231, toLocale(data.playCount));
  image.print(font, 370, 256, `${toLocale(data.accuracy)}%`);

  const playTimeString = `${data.playTime}`;
  image.print(font, 375, 284, `${formatPlayTime(playTimeString)}`);

  // print grades
  const grades = {
    ssh: data.grades.ssh,
    ss: data.grades.ss,
    sh: data.grades.sh,
    s: data.grades.s,
    a: data.grades.a,
  };
  Object.entries(grades).forEach((el, i) => {
    const start = 10 + 55 * i;
    image.print(
      font,
      start,
      300,
      {
        text: `${el[1]}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
      },
      45,
      14
    );
  });

  return image;
}

const toLocale = (data) => data.toLocaleString("en-US");

async function printSupporter(image) {
  const supporterImg = await Jimp.read(`${__dirname}/icons/supporter.png`);
  image.blit(supporterImg, 220, 10);
  return image;
}

function formatPlayTime(ms) {
  const days = Math.floor(ms / (24 * 60 * 60));
  ms = ms - days * (24 * 60 * 60);
  const hours = Math.floor(ms / (60 * 60));
  ms = ms - hours * (60 * 60);
  const minutes = Math.floor(ms / 60);
  ms = ms - minutes * 60;
  const sec = ms;

  return `${days}d ${hours}h ${minutes}m ${sec}s`;
}
