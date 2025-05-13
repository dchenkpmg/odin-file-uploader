const { Router } = require("express");
const router = Router();
const fileController = require("../controllers/fileController");

router.get("/:id", fileController.getFolder);
router.post("/:id/upload", fileController.uploadFile);
router.post("/:id/create-folder", fileController.createFolder);
router.post("/:id/update-folder/:child", fileController.updateFolder);
router.post("/:id/delete-folder/:child", fileController.deleteFolder);

module.exports = router;
