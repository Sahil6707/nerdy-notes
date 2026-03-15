const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  isPremium: {
    type: Boolean,
    default: false,
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  year: {
    type: Number,
    required: true,
  },

  module: {
    type: Number,
    required: true,
  },
});


noteSchema.index({ year: 1, subject: 1, module: 1 });
module.exports = mongoose.model("Note", noteSchema);
