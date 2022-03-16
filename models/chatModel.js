const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
  users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

// users - array of references to user collection

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
