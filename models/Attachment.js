const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  cardId: String,
  filename: String,
  imageBuffer: Buffer,
  imageType: String,
});

module.exports = mongoose.model("Attachment", attachmentSchema);
