const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

async function createUser(username, password) {
  console.log(`Creating user: ${username}`);
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
}

async function getUserByUsername(username) {
  console.log(`Getting user by username: ${username}`);
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
}

async function createFolder(userId, parentId, folderName) {
  console.log(
    `Creating folder: ${folderName} for user: ${userId}, parentId: ${parentId}`,
  );
  await prisma.file.create({
    data: {
      name: folderName,
      size: 0,
      userId: userId,
      isFolder: true,
      parentId: parentId === "root" ? null : parentId,
    },
  });
}

async function updateFolder(userId, childId, name) {
  console.log(
    `Updating folder with ID: ${childId} for user: ${userId} and name: ${name}`,
  );
  await prisma.file.update({
    where: {
      id: childId,
      userId: userId,
    },
    data: {
      name: name,
    },
  });
}

async function deleteFolder(userId, childId) {
  console.log(`Deleting folder with ID: ${childId} for user: ${userId}`);
  await prisma.file.delete({
    where: {
      id: childId,
      userId: userId,
    },
  });
}

async function getFiles(userId, parentId) {
  const files = await prisma.file.findMany({
    where: {
      userId: userId,
      parentId: parentId,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });
  return files;
}

async function getFile(userId, childId) {
  const file = await prisma.file.findUnique({
    where: {
      id: childId,
      userId: userId,
    },
  });
  return file;
}

async function createFile(userId, parentId, fileName, fileSize, filePath) {
  console.log(
    `Creating file: ${fileName} for user: ${userId}, parentId: ${parentId}`,
  );
  await prisma.file.create({
    data: {
      name: fileName,
      size: fileSize,
      userId: userId,
      url: filePath,
      isFolder: false,
      parentId: parentId === "root" ? null : parentId,
    },
  });
}

module.exports = {
  createUser,
  getUserByUsername,
  createFolder,
  updateFolder,
  deleteFolder,
  getFiles,
  getFile,
  createFile,
};
