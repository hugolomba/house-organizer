import { prisma } from "./app/lib/prisma";

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Connection OK! Users:", users);
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
