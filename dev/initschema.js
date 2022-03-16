const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

dotenv.config({ path: "../config.env" });

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB successfully connected!"))
  .catch((err) => console.log(err));
//

// const asikda = "a"
(async function () {
  //   const newuser = await User.create({ telegramId: 1 });

  //   const a = await Chat.create({
  //     chatId: 1,
  //     users: ["62275eb19d5f8055b4a2c58e", "6232148b9d5f8055b4dcef41"],
  //   });

  // users: ["62275eb19d5f8055b4a2c58e", "6232148b9d5f8055b4dcef41"],
  //   console.log(a);
  const data = await Chat.find().populate("users", { telegramId: 1 });
  console.log(data[0].users);
})();
