// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Handle MongoDB connection errors after initial connection
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Define Schema and Model for attachments
const attachmentSchema = new mongoose.Schema({
  cardId: String,
  filename: String,
  path: String,
});

const Attachment = mongoose.model("Attachment", attachmentSchema);

// Helper to sanitize filenames
const sanitizeFilename = (filename) =>
  filename.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = sanitizeFilename(file.originalname);
    cb(null, Date.now() + "-" + sanitizedFilename);
  },
});

const upload = multer({ storage });

// API Endpoint for file upload
app.post("/upload/:cardId", upload.array("files"), async (req, res) => {
  const { cardId } = req.params;

  try {
    // Save file info to MongoDB
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
});

// API Endpoint to get attachment count for a card
app.get("/attachments/:cardId/count", async (req, res) => {
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
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
