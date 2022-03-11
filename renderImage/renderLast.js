const Jimp = require("jimp");
const moment = require("moment");
const calculateMapPPnSR = require("./../calculateMapPPnSR");

async function renderLast(user, map, play) {
  let image = await Jimp.read(`${__dirname}/templateImages/last.png`);
  const avatar = await Jimp.read(user.avatarUrl);
  avatar.resize(190, 200).fade(0.4);
  image.blit(avatar, 0, 0);
  const background = await Jimp.read(map.covers.cover);
  background.resize(578, 200).fade(0.4);
  // .color([{ apply: "darken", params: [33] }]);
  image.blit(background, 190, 0);

  ({ map, play } = await calculateMapStats(map, play));
  // console.log(map, play);

  image = await printOnBackground(image, map);
  image = await printPlayStats(image, map, play);
  image = await printOnAvatar(image, user);

  await image.writeAsync("last1.png");
  return "last1.png";
}

module.exports = renderLast;

async function calculateMapStats(map, play) {
  if (play.mods.includes("HR")) {
    map.ar = Math.min(map.ar * 1.4, 10).toFixed(1);
    map.od = Math.min(map.od * 1.4, 10).toFixed(1);
    map.cs = (map.cs * 1.4).toFixed(1);
    map.hp = (map.hp * 1.4).toFixed(1);
  }
  if (play.mods.includes("EZ")) {
    map.cs = (map.cs / 2).toFixed(1);
    map.ar = (map.ar / 2).toFixed(1);
    map.od = (map.od / 2).toFixed(1);
    map.hp = (map.hp / 2).toFixed(1);
  }
  if (play.mods.includes("DT") || play.mods.includes("NC")) {
    map.bpm = +(map.bpm * 1.5).toFixed(1);
    map.duration = (map.duration / 1.5).toFixed();
    map.ar = Math.min((map.ar * 2 + 13) / 3, 11).toFixed(1);
    map.od = Math.min((map.od * 2 + 13) / 3, 11).toFixed(1);
  }
  if (play.mods.includes("HT")) {
    map.bpm = +(map.bpm * 0.75).toFixed(1);
    map.duration = (map.duration * 1.33).toFixed();
    map.ar = ((1800 - map.ar) / 120).toFixed(1);
    map.od = ((1800 - map.od) / 120).toFixed(1);
  }
  map.maxCombo = 999;
  map.sr = (99).toFixed(2);

  const calc = (await calculateMapPPnSR(map.id, play.mods)).toString();
  console.log(calc.replace(/─/g, ""));
  const songname = calc.slice(
    calc.indexOf(` ${map.id} `) + 1,
    calc.indexOf("\n")
  );
  console.log(songname);
  // map.artist =
  return { map, play };
}

async function printOnAvatar(image, user) {
  const font = await Jimp.loadFont(`${__dirname}/fonts/default.fnt`);
  const nicknameFont = await Jimp.loadFont(
    `${__dirname}/fonts/forUsernameOnScore.fnt`
  );
  const countryRankFont = await Jimp.loadFont(
    `${__dirname}/fonts/countryRank.fnt`
  );

  // username
  image.print(
    nicknameFont,
    0,
    0,
    { text: user.username, ...alignment },
    190,
    40
  );
  // pp
  image.print(
    countryRankFont,
    10,
    140,
    { text: `${user.performancePoints}pp`, ...alignment },
    190,
    30
  );
  // global rank
  image.print(
    font,
    10,
    163,
    { text: `Global: #${user.globalRank}`, ...alignment },
    190,
    30
  );
  // country rank
  image.print(
    font,
    10,
    180,
    { text: `${user.countryCode}: #${user.countryRank}`, ...alignment },
    190,
    30
  );

  // user supporter (turned of because cant really fit)
  // if (user.supporter) {
  //   const supporterImg = await Jimp.read(`${__dirname}/icons/supporter.png`);
  //   image.blit(supporterImg.resize(40, 40), 149, 0);
  // }

  return image;
}

async function printOnBackground(image, map) {
  const font = await Jimp.loadFont(`${__dirname}/fonts/lastDefault.fnt`);

  // cs
  image.print(font, 200, 175, `CS: ${map.cs}`);
  image.print(font, 270, 175, `AR: ${map.ar}`);
  image.print(font, 340, 175, `OD: ${map.od}`);
  image.print(font, 410, 175, `HP: ${map.hp}`);
  image.print(font, 480, 175, `SR: ${map.sr}`);

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
  image.print(font, 685, 170, `${+map.bpm.toFixed(1)}bpm`);

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
  image.print(mediumFont, 190, 335, `${play.combo}x/${map.maxCombo}x`);

  // count of 300s
  const font300 = await Jimp.loadFont(`${__dirname}/fonts/for300.fnt`);
  image.print(font300, 555, 335, `${play.count300}`);

  // count of 100s
  const font100 = await Jimp.loadFont(`${__dirname}/fonts/for100.fnt`);
  image.print(font100, 605, 335, `${play.count100}`);

  // count of 50s
  const font50 = await Jimp.loadFont(`${__dirname}/fonts/for50.fnt`);
  image.print(font50, 655, 335, `${play.count50}`);

  // count of Misses
  const fontMiss = await Jimp.loadFont(`${__dirname}/fonts/forMiss.fnt`);
  image.print(fontMiss, 686, 335, `${play.countMiss}`);

  // completion

  const completion = (
    ((play.count50 + play.count100 + play.count300 + play.countMiss) /
      map.objects) *
    100
  ).toFixed(2);
  image.print(mediumFont, 60, 425, `${completion}%`);

  // played
  image.print(mediumFont, 555, 425, moment(play.date).fromNow());
  // mods
  // console.log(play.mods);
  if (!play.mods.length) {
    const noModImg = await Jimp.read(`${__dirname}/icons/mods/NM.png`);
    image.blit(noModImg, 190, 245);
  } else
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
