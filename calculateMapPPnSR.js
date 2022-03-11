const { spawn, exec } = require("child_process");

async function calculateMapPPnSR(mapId, mods) {
  // await exec(
  //   `dotnet run -- simulate osu ${mapId}`,
  //   { cwd: `${__dirname}/osu-tools/PerformanceCalculator` },
  //   (err, stdout, stderr) => {
  //     if (err) return err;
  //     return stdout;
  //   }
  // );

  const command = spawn(
    `dotnet run`,
    ["-- simulate", "osu", mapId, "--mod:dt"],
    {
      shell: true,
      // stdio: "inherit",
      cwd: `${__dirname}/osu-tools/PerformanceCalculator`,
    }
  );

  return await new Promise((resolve, reject) => {
    command.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
      resolve(data);
    });
  });
  // command.stdout.on("data", (data) => {
  //   // console.log(`stdout: ${data}`);
  //   command.close();
  //   return data;
  // });

  command.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    return data;
  });

  command.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  command.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

module.exports = calculateMapPPnSR;
