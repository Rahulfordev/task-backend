const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const sanitizeFilename = (filename) =>
  filename.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();

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
module.exports = upload;
