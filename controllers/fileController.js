const db = require("../db/db");
const { upload } = require("../middlewares/multer");

async function getFolder(req, res) {
  const files = await db.getFiles(
    req.user.id,
    req.params.id === "root" ? null : req.params.id,
  );
  res.render("files", {
    user: req?.user,
    files: files,
    fileId: req.params.id,
  });
}

async function uploadFile(req, res) {
  upload(req, res, (err) => {
    if (err) {
      res.render("files", {
        message: "Error uploading file",
      });
    } else {
      if (req.file == undefined) {
        res.render("files", {
          message: "No file selected",
        });
      } else {
        res.render("files", {
          message: "File uploaded successfully",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
}

async function createFolder(req, res) {
  const userId = req.user.id;
  const parentId = req.params.id || null;
  await db.createFolder(userId, parentId, "New Folder");
  // const files = await db.getFiles(userId, parentId);
  res.send("Folder created successfully");
  // res.render("files", {
  //   files: files,
  //   // message: "Folder created successfully",
  // });
}

async function updateFolder(req, res) {
  const userId = req.user.id;
  const parentId = req.params.id || null;
  const childId = req.params.child;
  await db.updateFolder(userId, parentId, childId);
  res.send("Folder renamed successfully");
}

async function deleteFolder(req, res) {
  const userId = req.user.id;
  const parentId = req.params.id || null;
  const childId = req.params.child;
  await db.deleteFolder(userId, parentId, childId);
  res.send("Folder deleted successfully");
}

module.exports = {
  getFolder,
  uploadFile,
  createFolder,
  updateFolder,
  deleteFolder,
};
