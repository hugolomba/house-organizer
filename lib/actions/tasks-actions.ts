"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../auth";
import { headers } from "next/dist/server/request/headers";
import { House, Prisma } from "@/prisma/generated/client";
import { log } from "console";
import { logActivity } from "../activity";
import { revalidatePath } from "next/cache";

// mark a task as complete/incomplete
export async function toggleTaskStatus(taskId: number) {
  // get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session == null) {
    return;
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: !task.status,
    },
  });

  await logActivity({
    houseId: task.houseId,
    userId: session.user.id,
    type: "UPDATE",
    entity: "TASK",
    entityId: task.id,
    title: `Task "${task.title}" marked as ${
      updatedTask.status ? "complete" : "incomplete"
    }`,
    message: `${session.user.name} marked the task "${task.title}" as ${
      updatedTask.status ? "complete" : "incomplete"
    }`,
  });

  revalidatePath("/house");

  return updatedTask;
}

// create a task
export async function createTask(formData: FormData, houseId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const roomId = Number(formData.get("roomId"));
  const assignedIds = formData.getAll("assignedIds") as string[];

  const task = await prisma.task.create({
    data: {
      title,
      description,
      houseId,
      roomId,
      assigned: {
        connect: assignedIds.map((id) => ({ id })),
      },
    },
  });

  await logActivity({
    houseId: task.houseId,
    userId: session.user.id,
    type: "CREATE",
    entity: "TASK",
    entityId: task.id,
    title: `Task "${task.title}" has been created
    }`,
    message: `${session.user.name} has created the task "${task.title}"
    }`,
  });

  revalidatePath("/house");

  return task;
}
