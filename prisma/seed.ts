import { prisma } from "../lib/prisma";

async function main() {
  // 🧹 Clear existing data (order matters)
  await prisma.activity.deleteMany();
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
      image: "https://avatars.githubusercontent.com/u/98366477?v=4",
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

  await prisma.activity.create({
    data: {
      houseId: house.id,
      userId: user1.id,
      type: "CREATE",
      entity: "HOUSE",
      title: "Medusa's House has been created",
      message: "created the house Medusa's House",
    },
  });

  // 🚪 Rooms
  const livingRoom = await prisma.room.create({
    data: {
      name: "Living Room",
      houseId: house.id,
      roomType: "LIVING_ROOM",
      isCommon: true,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
      },
    },
  });

  const bedroom = await prisma.room.create({
    data: {
      name: "Hugo and Andrea's Room",
      houseId: house.id,
      roomType: "BEDROOM",
      isCommon: false,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  const bathroom = await prisma.room.create({
    data: {
      name: "Bathroom",
      houseId: house.id,
      roomType: "BATHROOM",
      isCommon: true,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
      },
    },
  });

  const kitchen = await prisma.room.create({
    data: {
      name: "Kitchen",
      houseId: house.id,
      roomType: "KITCHEN",
      isCommon: true,
      users: {
        connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
      },
    },
  });

  // ✅ Tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Clean the living room",
      status: true,
      houseId: house.id,
      roomId: livingRoom.id,
      assigned: {
        connect: [{ id: user2.id }],
      },
    },
  });

  await prisma.activity.create({
    data: {
      houseId: house.id,
      userId: user2.id,
      type: "COMPLETE",
      entity: "TASK",
      title: "Clean the living room has been completed",
      entityId: task1.id,
      message: "completed the task Clean the living room",
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Wash the dishes",
      description: "Wash plates, glasses, and cutlery",
      houseId: house.id,
      roomId: kitchen.id,
      assigned: {
        connect: [{ id: user1.id }],
      },
    },
  });

  await prisma.activity.create({
    data: {
      houseId: house.id,
      userId: user1.id,
      type: "CREATE",
      entity: "TASK",
      entityId: task2.id,
      title: "Wash the dishes has been created",
      message: "created the task Wash the dishes",
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Clean the bathroom",
      description: "Weekly cleaning",
      houseId: house.id,
      roomId: bathroom.id,
      assigned: {
        connect: [{ id: user1.id }],
      },
    },
  });

  await prisma.activity.create({
    data: {
      houseId: house.id,
      userId: user1.id,
      type: "CREATE",
      entity: "TASK",
      entityId: task3.id,
      title: "Clean the toilet has been created",
      message: "created the task Clean the toilet",
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: "Clean the living room",
      description: "Weekly cleaning",
      houseId: house.id,
      roomId: livingRoom.id,
      assigned: {
        connect: [{ id: user1.id }],
      },
    },
  });

  await prisma.activity.create({
    data: {
      houseId: house.id,
      userId: user1.id,
      type: "CREATE",
      entity: "TASK",
      entityId: task4.id,
      title: "Clean the living room has been created",
      message: "created the task Clean the living room",
    },
  });

  // 💸 Bill + Shares
  const bill1 = await prisma.bill.create({
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

  await prisma.activity.create({
    data: {
      houseId: house.id,
      userId: user1.id,
      type: "CREATE",
      entity: "BILL",
      title: "Electricity Bill has been created",
      entityId: bill1.id,
      message: "created the bill Electricity Bill",
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

  // 🔐 House Credentials
  await prisma.houseCredential.createMany({
    data: [
      {
        houseId: house.id,
        type: "WIFI",
        label: "Home Wi-Fi",
        username: "admin",
        password: "MedusaWifi123",
        notes: "Router is in the living room",
      },
      {
        houseId: house.id,
        type: "SERVICE",
        label: "Electricity Provider Account",
        email: "support@electricity.ie",
        password: "ElectricityPass2025",
        notes: "Used to manage electricity bills",
      },
      {
        houseId: house.id,
        type: "SERVICE",
        label: "Internet Provider Account",
        email: "support@internet.ie",
        password: "InternetPass2025",
        notes: "Account for internet service",
      },
      {
        houseId: house.id,
        type: "APPLIANCE",
        label: "Security Alarm System",
        username: "alarm_admin",
        password: "SecureAlarm123",
        notes: "Alarm panel code and app access",
      },
      {
        houseId: house.id,
        type: "OTHER",
        label: "Main Gate Access",
        notes: "Gate code changes every month",
      },
    ],
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

  await prisma.activity.createMany({
    data: [
      {
        houseId: house.id,
        userId: user1.id,
        type: "CREATE",
        entity: "ALERT",
        title: "Test warning has been created",
        message: "created an alert Test warning",
      },
      {
        houseId: house.id,
        userId: user1.id,

        type: "CREATE",
        entity: "ALERT",
        title: "Test warning 2 has been created",
        message: "created an alert Test warning 2",
      },
      {
        houseId: house.id,
        userId: user1.id,
        type: "CREATE",
        entity: "ALERT",
        title: "Test warning 3 has been created",
        message: "created an alert Test warning 3",
      },
    ],
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
