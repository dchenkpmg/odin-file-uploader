require("dotenv").config();
const db = require("../db/db");
const { decode } = require("base64-arraybuffer");
const { upload } = require("../middlewares/multer");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

async function getFolder(req, res) {
  const files = await db.getFiles(
    req.user.id,
    req.params.id === "root" ? null : parseInt(req.params.id),
  );
  if (req.params.id !== "root") {
    const f = await db.getFile(
      req.user.id,
      req.params.id === "root" ? null : parseInt(req.params.id),
    );
    const parentId = f.parentId;
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
    const file = req.file;
    if (!file) {
      req.flash("error", "No file uploaded");
      return res.redirect(`/files/${req.params.id}`);
    }
    const fileBase64 = decode(file.buffer.toString("base64"));

    // same file check
    const existingFiles = await db.getFiles(
      req.user.id,
      req.params.id === "root" ? null : parseInt(req.params.id),
    );

    const fileExists = existingFiles.some((existingFile) => {
      const parentId =
        req.params.id === "root" ? null : parseInt(req.params.id);
      return (
        existingFile.name === file.originalname &&
        existingFile.parentId === parentId
      );
    });

    if (fileExists) {
      console.log("File already exists");
      req.flash("error", "File already exists");
      return res.redirect(`/files/${req.params.id}`);
    }

    // Upload the file buffer directly
    const { data, error } = await supabase.storage
      .from("odin-file-upload")
      .upload(
        `${req.user.id}/${req.params.id}/${file.originalname}`,
        file.buffer, // Use the buffer directly
        {
          cacheControl: "3600",
          upsert: true,
        },
      );

    if (error) {
      console.error("Error uploading file to Supabase:", error);
      req.flash("error", "Error uploading file");
      return res.redirect(`/files/${req.params.id}`);
    }
    const userId = req.user.id;
    const parentId = parseInt(req.params.id) || null;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const filePath = data.path;
    await db.createFile(userId, parentId, fileName, fileSize, filePath);
    req.flash("success", "File uploaded successfully");
    res.redirect(`/files/${req.params.id}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
}

async function downloadFile(req, res) {
  const userId = req.user.id;
  const childId = parseInt(req.params.child);
  const f = await db.getFile(userId, childId);

  console.log("File path:", f.url);

  const { data, error } = await supabase.storage
    .from("odin-file-upload")
    .download(f.url);

  if (error) {
    console.error("Error downloading file from Supabase:", error);
    return res.status(500).send("Error downloading file");
  }
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader("Content-Disposition", `attachment; filename=${f.name}`);
  res.setHeader("Content-Type", data.type);
  res.send(buffer);
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
  downloadFile,
  createFolder,
  updateFolder,
  deleteFolder,
};
