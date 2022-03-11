const { spawn, exec } = require("child_process");
const { resolve } = require("path");

async function calculateMapPPnSR(mapId, mods, play) {
  // console.log(mapId, mods, play);

  const command = spawn(
    `PerformanceCalculator.exe`,
    [
      "simulate",
      "osu",
      mapId,
      play?.combo ? `--combo ${play.combo}` : "",
      play?.countMiss ? `--misses ${play.countMiss}` : "",
      play?.count50 ? `--mehs ${play.count50}` : "",
      play?.count100 ? `--goods ${play.count100}` : "",
      mods.length ? `--mod:${mods.join(" --mod:")}` : "",
      "--json",
    ],
    {
      shell: true,
      cwd: `${__dirname}/osu-tools/PerformanceCalculator/bin/Release/net6.0/win10-x64`,
    }
  );
  // console.log(command);

  command.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    return data;
  });

  // command.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  command.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  return await new Promise((resolve, reject) => {
    command.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
      if (data.indexOf(`Downloading ${mapId}.osu...`) === -1)
        resolve(JSON.parse(data));
    });
  });

  // command.on("close", (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });
}

module.exports = calculateMapPPnSR;
