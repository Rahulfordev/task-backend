const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const {
  uploadFiles,
  getAttachmentCount,
} = require("../controllers/attachmentController");

router.post("/upload/:cardId", upload.array("files"), uploadFiles);
router.get("/attachments/:cardId/count", getAttachmentCount);

module.exports = router;
