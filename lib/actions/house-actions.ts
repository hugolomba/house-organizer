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
