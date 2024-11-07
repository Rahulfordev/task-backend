const Attachment = require("../models/Attachment");

const uploadFiles = async (req, res) => {
  const { cardId } = req.params;

  try {
    const attachments = req.files.map((file) => ({
      cardId,
      filename: file.originalname,
      path: file.path,
    }));

    await Attachment.insertMany(attachments);
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

const getAttachmentCount = async (req, res) => {
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

module.exports = { uploadFiles, getAttachmentCount };
