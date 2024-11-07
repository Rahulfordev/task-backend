const Attachment = require("../models/Attachment");
const sanitizeFilename = require("../utils/sanitizeFilename");

exports.uploadFiles = async (req, res) => {
  const { cardId } = req.params;

  try {
    const attachments = await Promise.all(
      req.files.map(async (file) => {
        const sanitizedFilename = sanitizeFilename(file.originalname);
        const newAttachment = new Attachment({
          cardId,
          filename: sanitizedFilename,
          imageBuffer: file.buffer,
          imageType: file.mimetype,
        });
        await newAttachment.save();
        return { filename: sanitizedFilename };
      })
    );

    const count = await Attachment.countDocuments({ cardId });
    res.json({
      message: "Files uploaded successfully",
      count,
      uploadedFiles: attachments.map((file) => file.filename),
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getAttachmentCount = async (req, res) => {
  const { cardId } = req.params;

  try {
    const count = await Attachment.countDocuments({ cardId });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching attachment count:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
