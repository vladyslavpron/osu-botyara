const { spawn } = require("child_process");

// const command = spawn("cmd.exe", [
//     `${__dirname}/osu-tools/performanceCalculator`,
//     "dotnet run",
//     "-- simulate",
//     "osu",
//     "1828691",
//     "--mod:dt",
//   ]);
// const cd = spawn("cd", [
//   "F:/JavaScript/osu-botyara/osu-tools/PerformanceCalculator",
// ]);
// let command = spawn(
//   "cd",
//   ["F:/JavaScript/osu-botyara/osu-tools/PerformanceCalculator"],
//   { shell: true }
// );
// command.on("error", (error) => console.log("Cannot change dir: \n", error));

const command = spawn(
  `dotnet run`,
  ["-- simulate", "osu", "1828691", "--mod:dt"],
  {
    shell: true,
    cwd: "F:/JavaScript/osu-botyara/osu-tools/PerformanceCalculator",
  }
);
// const command = spawn(`dir`, [], { shell: true });

command.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

command.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

command.on("error", (error) => {
  console.log(`error: ${error.message}`);
});

command.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
