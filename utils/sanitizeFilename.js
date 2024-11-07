const sanitizeFilename = (filename) =>
  filename.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();

module.exports = sanitizeFilename;
