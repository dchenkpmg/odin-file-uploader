const { Router } = require("express");
const router = Router();
const { isAuth } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");
const fileController = require("../controllers/fileController");

router.get("/:id", isAuth, fileController.getFolder);
router.post("/:id/upload", isAuth, upload, fileController.uploadFile);
router.post("/:id/download/:child", isAuth, fileController.downloadFile);
router.post("/:id/create-folder", isAuth, fileController.createFolder);
router.post("/:id/update-folder/:child", isAuth, fileController.updateFolder);
router.post("/:id/delete-folder/:child", isAuth, fileController.deleteFolder);

module.exports = router;
