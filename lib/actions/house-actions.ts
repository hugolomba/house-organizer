"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../auth";
import { headers } from "next/dist/server/request/headers";
import { logActivity } from "../activity";

// create a house
export async function createHouse({
  name,
  address,
  imageUrl,
}: {
  name: string;
  address?: string;
  imageUrl?: string;
}) {
  // get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  //   get user from db to check if they already have a house
  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  // if user already has a house, return
  if (user?.houseId) {
    throw new Error("User already has a house");
  }

  if (session == null) {
    return;
  }

  const newHouse = await prisma.house.create({
    data: {
      name,
      address,
      imageUrl: imageUrl || null,
      createdBy: {
        connect: { id: session.user.id },
      },
      users: {
        connect: { id: session.user.id },
      },
    },
  });

  // create a room
  await prisma.room.create({
    data: {
      name: "Living Room",
      roomType: "LIVING_ROOM",
      house: {
        connect: { id: newHouse.id },
      },
    },
  });

  await logActivity({
    houseId: newHouse.id,
    userId: session.user.id,
    type: "CREATE",
    entity: "HOUSE",
    entityId: newHouse.id,
    title: `${newHouse.name} has been created`,
    message: `${session.user.name} created the house ${newHouse.name}`,
  });

  return newHouse;
}

// Get house by invite code
export async function getHouseByInviteCode(inviteCode: string) {
  const house = await prisma.house.findUnique({
    where: { inviteCode },
    include: {
      users: true,
    },
  });

  if (!house) {
    throw new Error("Invalid invite code");
  }

  return house;
}

// join house
export async function joinHouseByInviteCode(inviteCode: string) {
  // get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null) {
    return;
  }

  const house = await prisma.house.findUnique({
    where: { inviteCode },
  });

  if (!house) {
    throw new Error("House not found");
  }

  // add user to house
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      houseId: house.id,
    },
  });

  await logActivity({
    houseId: house.id,
    userId: session.user.id,
    type: "UPDATE",
    entity: "HOUSE",
    entityId: house.id,
    title: `${session.user.name} joined the house`,
    message: `${session.user.name} joined the house ${house.name}`,
  });

  return updatedUser;
}

// Just check if user has an house

export async function checkIfUserHasHouse(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.houseId !== null) {
    return true;
  } else {
    return false;
  }
}

// Get house by user ID
export async function getHouseByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      house: true,
    },
  });

  return user?.house || null;
}

// get user by user id
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user || null;
}

// get house by house id
export async function getHouseById(houseId: number) {
  // authorization check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.houseId || user.houseId !== houseId) {
    throw new Error("Not authorized in this house");
  }

  const house = await prisma.house.findUnique({
    where: { id: houseId },
    include: {
      users: true,
      tasks: {
        include: {
          room: {
            select: {
              name: true,
              roomType: true,
            },
          },
          assigned: {
            select: {
              name: true,
            },
          },
        },
      },
      bills: {
        include: {
          shares: {
            include: {
              user: true,
            },
          },
          responsible: true,
        },
        orderBy: { dueDate: "desc" },
      },
      infos: true,
      alerts: true,
      credentials: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      rooms: {
        include: {
          tasks: {
            include: {
              room: {
                select: {
                  name: true,
                  roomType: true,
                },
              },
              assigned: {
                select: {
                  name: true,
                },
              },
            },
          },
          users: true,
        },
      },
    },
  });

  if (!house) {
    throw new Error("House not found");
  }
  // Sort alerts by priority: URGENT, HIGH, MEDIUM, LOW
  const priorityOrder = ["URGENT", "HIGH", "MEDIUM", "LOW"];
  house.alerts.sort(
    (a, b) =>
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority),
  );
  return house;
}

// get demo house
export async function getDemoHouse() {
  const house = await prisma.house.findUnique({
    where: { id: 3 }, // demo house
    include: {
      users: true,
      tasks: {
        include: {
          room: {
            select: {
              name: true,
              roomType: true,
            },
          },
          assigned: {
            select: {
              name: true,
            },
          },
        },
      },
      bills: {
        include: {
          shares: {
            include: {
              user: true,
            },
          },
          responsible: true,
        },
        orderBy: { dueDate: "desc" },
      },
      infos: true,
      alerts: true,
      credentials: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      rooms: {
        include: {
          tasks: {
            include: {
              room: {
                select: {
                  name: true,
                  roomType: true,
                },
              },
              assigned: {
                select: {
                  name: true,
                },
              },
            },
          },
          users: true,
        },
      },
    },
  });
  return house;
}

// leave house
export async function leaveHouse() {
  // authorization check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.houseId) {
    throw new Error("Not authorized in this house");
  }

  // remove user from house
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      houseId: null,
    },
  });

  await logActivity({
    houseId: user.houseId,
    userId: session.user.id,
    type: "UPDATE",
    entity: "HOUSE",
    entityId: user.houseId,
    title: `${updatedUser.name} left the house`,
    message: `${updatedUser.name} left the house`,
  });

  return updatedUser;
}

// delete house
export async function deleteHouse() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null || !session.user.houseId) {
    return;
  }

  // first delete all activities, bills, tasks associated with the house
  await prisma.activity.deleteMany({
    where: { houseId: session.user.houseId },
  });
  await prisma.bill.deleteMany({ where: { houseId: session.user.houseId } });
  await prisma.task.deleteMany({ where: { houseId: session.user.houseId } });

  const house = await prisma.house.delete({
    where: { id: session.user.houseId },
  });

  return house;
}

// get house activities
export async function getHouseActivities() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null || !session.user.houseId) {
    return [];
  }

  const activities = await prisma.activity.findMany({
    where: { houseId: session.user.houseId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return activities;
}
