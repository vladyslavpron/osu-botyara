// const Jimp = require("jimp");
const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

// TODO: REWORK EVERYTHING WITH SHARP

async function renderConf(beatmap, scores) {
  const background = await processBg(beatmap);
  const banner = await processBanner();
  const image = await sharp({
    create: {
      width: 1024,
      height: 800,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([
      {
        input: background,
        left: 0,
        top: 0,
      },
      { input: banner, top: 255, left: 0 },
    ])
    .toFormat("png")
    .toBuffer();

  fs.writeFileSync("conf1.png", image);
  return "conf1.png";

  async function processBanner() {
    const bannerTextBuffer = Buffer.from(
      `<svg height="40" width="1024"> 
    <style>
    @font-face{
      font-family: "Roboto";
      src: url("/fonts/conf/Roboto.ttf") format("truetype");
    }</style>
    <text textLength="1024" x="50" y="28" font-size="24" fill="white" font-family="Roboto" font-weight="700"  >Chat best scores:</text> 
    </svg>`
    );

    const coloumnsTextStyles =
      'textLength="1024" font-size="24" fill="#8C92AC"  font-weight="500"';
    const coloumnsTextBuffer = Buffer.from(
      `<svg height="40" width="1024"> 
    <text x="5" y="24" ${coloumnsTextStyles}>Rank</text> 
    <text x="25" y="24" ${coloumnsTextStyles}>Global</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>Player</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>Score</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>PP</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>Combo</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>Mods</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>Accuracy</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>300</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>100</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>50</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>x</text> 
    <text x="55" y="24" ${coloumnsTextStyles}>Date</text> 
    </svg>`
    );

    const banner = await sharp(`${__dirname}/templateImages/topBanner.png`)
      .resize(1024, 80)
      .composite([
        { input: bannerTextBuffer, top: 0, left: 0 },
        { input: coloumnsTextBuffer, top: 45, left: 0 },
      ])
      .toBuffer();

    return banner;
  }

  async function processBg(beatmap) {
    //  get image
    const backgroundReq = await axios({
      url: beatmap.beatmapset.covers["cover@2x"],
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(backgroundReq.data, "binary");

    // to fade image
    const darkenbg = await sharp({
      create: {
        width: 1024,
        height: 250,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0.3 },
      },
    })
      .toFormat("png")
      .toBuffer();

    // to round corners
    const rect = Buffer.from(
      '<svg><rect x="0" y="0" width="1024" height="250" rx="50" ry="50"/></svg>'
    );

    // map name
    const mapNameBuffer = Buffer.from(` 
      <svg height="80" width="974" viewBox="0 0 1024 100"> 
      <style>@font-face{font-family: "Roboto";src: url("/fonts/conf/Roboto.ttf") format("truetype");}</style>
      <text textLength="974" x="0" y="32" fill="white" font-family="Roboto" font-weight="700" font-size="32px" >${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title}</text>
     <text textLength="974" x="487" y="64" fill="white" font-family="Roboto" font-weight="700" font-size="32px" >
     By (${beatmap.beatmapset.creator}) [${beatmap.version}]</text>
     </svg>`);

    // ext: `${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title} (${beatmap.beatmapset.creator}) [${beatmap.version}]`,

    // map stats
    const mapStatsStyles =
      'font-size="22" color="white" fill="white" font-family="Roboto" font-weight="900"';

    const min = Math.floor(beatmap.total_length / 60);
    const sec = beatmap.total_length - min * 60;
    const duration = `${min}:${sec < 10 ? 0 : ""}${sec}`;

    const mapStatsBuffer = Buffer.from(
      `<svg height="40" width="1024"> 
    <style>
    @font-face{
      font-family: "Roboto";
      src: url("/fonts/conf/Roboto.ttf") format("truetype");
    }</style>
    <text  x="100" y="20" ${mapStatsStyles} >CS: ${beatmap.cs}</text> 
    <text  x="200" y="20" ${mapStatsStyles} >AR: ${beatmap.ar}</text> 
    <text x="300" y="20" ${mapStatsStyles} >OD: ${beatmap.accuracy}</text> 
    <text x="400" y="20" ${mapStatsStyles} >HP: ${beatmap.drain}</text> 
    <text x="500" y="20" ${mapStatsStyles} >SR: ${
        beatmap.difficulty_rating
      }</text> 
    <text x="600" y="20" ${mapStatsStyles} >BPM: ${beatmap.bpm.toFixed(
        1
      )}</text> 
    <text x="750" y="20" ${mapStatsStyles} >Length: ${duration}</text> 
    </svg>`
    );

    // take all together
    const bufferbg = await sharp(buffer)
      .resize(1024, 250)
      .composite([
        { input: rect, blend: "dest-in" },
        { input: darkenbg },
        { input: mapStatsBuffer, left: 10, top: 220 },
        { input: mapNameBuffer, left: 25, top: 5 },
      ])
      .toFormat("png")
      .toBuffer();
    return bufferbg;
  }
}

// const background = (
//   await sharp(
//     await axios({
//       url: beatmap.beatmapset.covers["cover@2x"],
//       responseType: "arraybuffer",
//     })
//   ).
// )
//   .resize({ width: 1024, height: 250 })
//   .png()
//   .toBuffer();

//   console.log();

//   const image = await sharp({
//     create: {
//       width: 1024,
//       height: 800,
//       channels: 4,
//       background: { r: 0, g: 0, b: 0, alpha: 1 },
//     },
//   })
//     .composite([
//       {
//         input: background,
//         left: 0,
//         top: 0,
//       },
//     ])
//     .png()
//     .toFile(__dirname + "../conf1.png");
// }

// async function renderConf(beatmap, scores) {
//   let image = new Jimp(912, 250 + scores.length * 20 + 50, "#000000");

//   let template = await Jimp.read(`${__dirname}/templateImages/conf.png`);
//   image.blit(template, 0, 0);

//   const background = await Jimp.read(beatmap.beatmapset.covers["cover@2x"]);
//   background.resize(902, 205).fade(0.3);
//   image.blit(background, 5, 5);

//   // console.log(beatmap);

//   await printMapInfo(beatmap);

//   const scoresImg = await printScores(scores, beatmap.max_combo);
//   image.blit(scoresImg, 0, 249);

//   await image.writeAsync("conf1.png");
//   return "conf1.png";

//   async function printMapInfo(beatmap) {
//     const font = await Jimp.loadFont(`${__dirname}/fonts/lastDefault.fnt`);
//     const fontForName = await Jimp.loadFont(
//       `${__dirname}/fonts/mediumLast.fnt`
//     );

//     image.print(
//       fontForName,
//       20,
//       5,
//       {
//         text: `${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title} (${beatmap.beatmapset.creator}) [${beatmap.version}]`,
//         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
//         alignmentY: Jimp.VERTICAL_ALIGN_TOP,
//       },
//       862,
//       50
//     );

//     // stats
//     image.print(font, 200, 175, `CS: ${beatmap.cs}`);
//     image.print(font, 275, 175, `AR: ${beatmap.ar}`);
//     image.print(font, 350, 175, `OD: ${beatmap.accuracy}`);
//     image.print(font, 425, 175, `HP: ${beatmap.drain}`);
//     image.print(font, 500, 175, `SR: ${beatmap.difficulty_rating}`);

//     // print duration and bpm values
//     const min = Math.floor(beatmap.total_length / 60);
//     const sec = beatmap.total_length - min * 60;
//     const duration = `${min}:${sec < 10 ? 0 : ""}${sec}`;
//     image.print(font, 575, 175, `DUR: ${duration}`);
//     image.print(font, 650, 175, `BPM: ${+beatmap.bpm.toFixed(1)}`);
//   }
// }

// async function printScores(scores, maxCombo) {
//   //   let image = await Jimp.read(`${__dirname}/templateImages/conf.png`);
//   let image = new Jimp(912, scores.length * 20 + 50, "#000000");

//   const font = await Jimp.loadFont(`${__dirname}/fonts/conf/scoresStats.fnt`);
//   const font300 = await Jimp.loadFont(`${__dirname}/fonts/conf/for300.fnt`);
//   const font100 = await Jimp.loadFont(`${__dirname}/fonts/conf/for100.fnt`);
//   const font50 = await Jimp.loadFont(`${__dirname}/fonts/conf/for50.fnt`);
//   const fontMiss = await Jimp.loadFont(`${__dirname}/fonts/conf/forMiss.fnt`);

//   image.resize(912, scores.length * 20);

//   scores.forEach((score, i) => {
//     // console.log(score);
//     const y = 20 * i;
//     print(font, 25, y, `#${i + 1}`, 37, 12);
//     print(font, 77, y, `#${score.position.toLocaleString("en-US")}`, 46, 12);
//     print(font, 145, y, score.user.username, 100, 12);
//     print(font, 255, y, score.score.toLocaleString("en-US"), 90, 12);
//     print(font, 355, y, `${score.pp.toFixed()}pp`, 45, 12);
//     print(font, 420, y, `${score.max_combo}x/${maxCombo}x`, 75, 12);
//     print(font, 510, y, `${score.mods.join("")}`, 85, 12);
//     print(font, 620, y, `${(score.accuracy * 100).toFixed(2)}%`, 63, 12);
//     print(font300, 697, y, score.statistics.count_300, 26, 12);
//     print(font100, 734, y, score.statistics.count_100, 26, 12);
//     print(font50, 769, y, score.statistics.count_50, 22, 12);
//     print(fontMiss, 795, y, score.statistics.count_miss, 22, 12);
//     print(font, 825, y, moment(score.created_at).format("DD/MM/YYYY"), 70, 12);
//   });

//   function print(font, x, y, text, maxx, maxy) {
//     image.print(
//       font,
//       x,
//       y,
//       {
//         text: `${text}`,
//         ...centerAlignment,
//       },
//       maxx,
//       maxy
//     );
//   }

//   return image;
// }

// const centerAlignment = {
//   alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
//   alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
// };

module.exports = renderConf;
