import { prisma } from "../lib/prisma";

async function main() {
  // 🧹 Clear existing data (order matters)
  await prisma.alert.deleteMany();
  await prisma.share.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.task.deleteMany();
  await prisma.room.deleteMany();
  await prisma.houseCredential.deleteMany();
  await prisma.houseInfo.deleteMany();
  await prisma.house.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // 👤 Users
  const user1 = await prisma.user.create({
    data: {
      id: "user1",
      name: "Hugo",
      email: "hmlomba@gmail.com",
      image: "https://avatars.githubusercontent.com/u/16869726?v=4",
      emailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user2",
      name: "Andrea",
      email: "andrea@example.com",
      image:
        "https://blogapp.hugo-miranda.dev/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdck0d5qwp%2Fimage%2Fupload%2Fv1756982340%2Fandrea_m4z2tx.png&w=128&q=75",
      emailVerified: false,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user3",
      name: "Rafaela",
      email: "rafaela@example.com",
      image:
        "https://blogapp.hugo-miranda.dev/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdck0d5qwp%2Fimage%2Fupload%2Fv1756982340%2Frafaela_tqf6y5.png&w=128&q=75",
      emailVerified: false,
    },
  });

  // 🏠 House
  const house = await prisma.house.create({
    data: {
      name: "Medusa's House",
      address: "89 Terenure Road North, Dublin",
      imageUrl: "",

      createdBy: {
        connect: { id: user1.id },
      },

      users: {
        connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
      },

      infos: {
        create: [
          { key: "City", value: "Dublin" },
          { key: "wifiPassword", value: "5mJ{d3XT" },
        ],
      },
    },
  });

  // 🚪 Rooms
  const livingRoom = await prisma.room.create({
    data: {
      name: "Living Room",
      houseId: house.id,
    },
  });

  const bedroom = await prisma.room.create({
    data: {
      name: "Hugo and Andrea's Room",
      houseId: house.id,
    },
  });

  // ✅ Tasks
  await prisma.task.create({
    data: {
      title: "Clean the living room",
      status: true,
      roomId: livingRoom.id,
      assigned: {
        connect: [{ id: user2.id }],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Wash the dishes",
      description: "Wash plates, glasses, and cutlery",
      roomId: bedroom.id,
      assigned: {
        connect: [{ id: user1.id }],
      },
    },
  });

  // 💸 Bill + Shares
  await prisma.bill.create({
    data: {
      title: "Electricity Bill",
      description: "Bill for the month of December",
      totalValue: 120.5,
      dueDate: new Date("2025-12-31"),

      houseId: house.id,
      responsibleId: user1.id,

      shares: {
        create: [
          {
            userId: user1.id,
            value: 60.25,
            paid: true,
          },
          {
            userId: user2.id,
            value: 60.25,
            paid: false,
          },
        ],
      },
    },
  });

  await prisma.bill.create({
    data: {
      title: "Internet",
      description: "Bill for the month of December",
      totalValue: 20,
      dueDate: new Date("2025-12-26"),

      houseId: house.id,
      responsibleId: user1.id,

      shares: {
        create: [
          {
            userId: user1.id,
            value: 10,
            paid: true,
          },
          {
            userId: user2.id,
            value: 10,
            paid: false,
          },
        ],
      },
    },
  });

  await prisma.bill.create({
    data: {
      title: "Electricity Bill",
      description: "Bill for the month of December",
      totalValue: 300,
      dueDate: new Date("2025-12-28"),

      houseId: house.id,
      responsibleId: user1.id,

      shares: {
        create: [
          {
            userId: user1.id,
            value: 150,
            paid: true,
          },
          {
            userId: user2.id,
            value: 150,
            paid: false,
          },
        ],
      },
    },
  });

  // 🚨 Alert
  await prisma.alert.createMany({
    data: [
      {
        title: "Test warning",
        message: "Test alert message",
        priority: "HIGH",

        createdById: user1.id,
        houseId: house.id,

        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      {
        title: "Test warning 2",
        message: "Test alert message",
        priority: "MEDIUM",

        createdById: user1.id,
        houseId: house.id,

        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      {
        title: "Test warning 3",
        message: "Test alert message",
        priority: "URGENT",

        createdById: user1.id,
        houseId: house.id,

        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
