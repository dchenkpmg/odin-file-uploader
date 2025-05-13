const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
}

async function createFolder(userId, parentId, folderName) {
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

async function updateFolder(userId, parentId, childId, name) {
  await prisma.file.update({
    data: {
      w,
    },
  });
}

async function getFiles(userId, parentId) {
  const files = await prisma.file.findMany({
    where: {
      userId: userId,
      parentId: parentId,
    },
  });
  return files;
}

module.exports = {
  createUser,
  createFolder,
  getFiles,
};
