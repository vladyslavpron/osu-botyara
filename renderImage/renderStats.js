const Jimp = require("jimp");

async function renderStats(user) {
  let image = await Jimp.read(`${__dirname}/templateImages/stats.png`);
  const avatar = await Jimp.read(user.data.avatarUrl);
  avatar.resize(263, 256);
  image.blit(avatar, 10, 10);

  // avatar 10-273 10-266

  // 283-502 10-162 - flag
  const flag = await Jimp.read(
    `${__dirname}/flags/${user.data.country.code}.png`
  );
  flag.resize(219, 152).color([{ apply: "darken", params: [25] }]);
  image.blit(flag, 283, 10);

  image = await printStats(user.data, image);
  await image.writeAsync("stats1.png");

  return "stats1.png";
}

module.exports = renderStats;

async function printStats(data, image) {
  const toLocale = (data) => data.toLocaleString("en-US");

  const font = await Jimp.loadFont(`${__dirname}/fonts/default.fnt`);

  // console.log(data);
  // print on flag
  image.print(
    font,
    283,
    50,
    {
      text: `${data.nickname}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
    },
    229,
    20
  );
  image.print(
    font,
    283,
    110,
    {
      text: `${data.country.name} : ${data.countryRank}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
    },
    229,
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

  // image.print(
  //   font,
  //   20,
  //   300,
  //   {
  //     text: `${data.grades.ssh}`,
  //     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  //     alignmentY: Jimp.VERTICAL_ALIGN_TOP,
  //   },
  //   30,
  //   10
  // );

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
