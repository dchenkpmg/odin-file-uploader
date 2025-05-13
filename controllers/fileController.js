const db = require("../db/db");
const { upload } = require("../middlewares/multer");

async function getFolder(req, res) {
  const files = await db.getFiles(
    req.user.id,
    req.params.id === "root" ? null : parseInt(req.params.id),
  );
  if (req.params.id !== "root") {
    const parentId = await db.getParentId(
      req.user.id,
      req.params.id === "root" ? null : parseInt(req.params.id),
    );
    res.render("files", {
      user: req?.user,
      files: files,
      fileId: req.params.id,
      parentId: parentId === null ? "root" : parentId,
    });
  } else {
    res.render("files", {
      user: req?.user,
      files: files,
      fileId: req.params.id,
      parentId: null,
    });
  }
}

async function uploadFile(req, res, next) {
  try {
    const userId = req.user.id;
    const parentId = req.params.id || null;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const filePath = req.file.path;
    await db.createFile(userId, parentId, fileName, fileSize, filePath);
    req.flash("success", "File uploaded successfully");
    res.redirect(`/files/${req.params.id}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
}

async function createFolder(req, res) {
  const userId = req.user.id;
  const parentId = req.params.id || null;
  await db.createFolder(userId, parseInt(parentId), "New Folder");
  res.redirect(`/files/${req.params.id}`);
}

async function updateFolder(req, res) {
  const userId = req.user.id;
  const childId = parseInt(req.params.child);
  await db.updateFolder(userId, childId, req.body.name);
  res.redirect(`/files/${req.params.id}`);
}

async function deleteFolder(req, res) {
  const userId = req.user.id;
  const childId = parseInt(req.params.child);
  await db.deleteFolder(userId, childId);
  res.redirect(`/files/${req.params.id}`);
}

module.exports = {
  getFolder,
  uploadFile,
  createFolder,
  updateFolder,
  deleteFolder,
};
