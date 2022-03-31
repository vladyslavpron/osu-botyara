const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: [true, "User must have telegram id"],
    unique: true,
  },
  osuId: {
    type: Number,
  },
  globalRank: {
    type: Number,
  },
  countryRank: {
    type: Number,
  },
  performancePoints: {
    type: Number,
  },
  playcount: {
    type: Number,
  },
  accuracy: {
    type: Number,
  },
  playTime: {
    type: Number,
  },
  grades: Object,
  lastInteractionDate: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
