// get all house
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const userHouse = await prisma.house.findMany({
    where: {
      createdById: "user1", // Replace with the actual house ID you want to query
    },
    include: {
      alerts: true,
      bills: {
        include: {
          shares: {
            include: {
              user: true,
            },
          },
          responsible: true,
        },
      },
      createdBy: true,
      infos: true,
      rooms: true,
      users: true,
    },
  });

  if (!userHouse) {
    return NextResponse.json({ message: "House not found" }, { status: 404 });
  }

  return NextResponse.json(userHouse);
}
