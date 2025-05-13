const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB
}).single("file");

module.exports = {
  upload,
};
