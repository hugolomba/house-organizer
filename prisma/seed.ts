import { prisma } from "../lib/prisma";

// await prisma.comment.deleteMany();

async function main() {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "test@test.com",
    },
  });

  console.log("Seed finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
