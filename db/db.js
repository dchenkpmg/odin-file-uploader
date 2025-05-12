import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({});

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });
}

module.exports = {
  createUser,
};
