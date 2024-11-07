const express = require("express");
const router = express.Router();
const {
  uploadFiles,
  getAttachmentCount,
} = require("../controllers/attachmentController");
const upload = require("../middleware/upload");

router.post("/upload/:cardId", upload.array("files"), uploadFiles);
router.get("/attachments/:cardId/count", getAttachmentCount);

module.exports = router;
