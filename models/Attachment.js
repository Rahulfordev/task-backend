const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  cardId: String,
  filename: String,
  path: String,
});

module.exports = mongoose.model("Attachment", attachmentSchema);
