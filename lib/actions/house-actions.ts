"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../auth";
import { headers } from "next/dist/server/request/headers";
import { House, Prisma } from "@/prisma/generated/client";

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
  const house = await prisma.house.findUnique({
    where: { id: houseId },
    include: {
      users: true,
      bills: {
        include: {
          shares: {
            include: {
              user: true,
            },
          },
          responsible: true,
        },
        orderBy: { dueDate: "asc" },
      },
      infos: true,
      alerts: true,
      credentials: true,
      rooms: {
        include: {
          tasks: {
            include: {
              assigned: true,
            },
          },
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
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );
  return house;
}
