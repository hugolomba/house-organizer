"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "../auth";
import { headers } from "next/dist/server/request/headers";
import { logActivity } from "../activity";
import { revalidatePath } from "next/cache";

export async function createRoom(
  FormData: FormData,
  isCommon: boolean,
  houseId: number,
  userIds: string[],
) {
  // get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null) {
    return;
  }

  const name = FormData.get("name") as string;
  const roomType = FormData.get("roomType") as
    | "LIVING_ROOM"
    | "KITCHEN"
    | "BATHROOM"
    | "BEDROOM"
    | "EXTERNAL"
    | "OTHER";

  const newRoom = await prisma.room.create({
    data: {
      name,
      roomType,
      isCommon,
      houseId,
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
  await logActivity({
    houseId: newRoom.houseId,
    userId: session.user.id,
    type: "CREATE",
    entity: "HOUSE",
    entityId: newRoom.id,
    title: `${newRoom.name} has been created`,
    message: `${session.user.name} created the house ${newRoom.name}`,
  });

  revalidatePath("/house/rooms");

  return newRoom;
}

export async function deleteRoom(roomId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null) {
    return;
  }

  // first delete all tasks associated with the room
  await prisma.task.deleteMany({
    where: { roomId },
  });

  const room = await prisma.room.delete({
    where: { id: roomId },
  });

  await logActivity({
    houseId: room.houseId,
    userId: session.user.id,
    type: "DELETE",
    entity: "ROOM",
    entityId: room.id,
    title: `Room "${room.name}" deleted.`,
    message: `Room "${room.name}" has been deleted.`,
  });

  revalidatePath("/house/rooms");

  return room;
}

// export async function deleteRoom(roomId: string) {
//   const room = await prisma.room.delete({
//     where: { id: roomId },
//   });

//   await logActivity(
//     room.houseId,
//     `Room "${room.name}" deleted.`
//   );

//   return room;
// }

// export async function updateRoom(
//   roomId: string,
//   name: string,
//   roomType: string,
//   isCommon: boolean,
//   userIds: string[]
// ) {
//   const room = await prisma.room.update({
//     where: { id: roomId },
//     data: {
//       name,
//       roomType,
//       isCommon,
//       users: {
//         set: userIds.map((id) => ({ id })),
//       },
//     },
//   });

//   await logActivity(
//     room.houseId,
//     `Room "${name}" updated.`
//   );

//   return room;
// }
