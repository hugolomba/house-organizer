"use server";
import { prisma } from "@/lib/prisma";
import { log } from "console";
import { revalidatePath } from "next/cache";
import { logActivity } from "../activity";
import { headers } from "next/dist/server/request/headers";
import { auth } from "../auth";
import { getUserById } from "./house-actions";
// mark an alert as solved
export async function markAlertAsResolved(alertId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // update alert in db
  const updatedAlert = await prisma.alert.update({
    where: { id: alertId },
    data: { isResolved: true },
  });

  await logActivity({
    houseId: updatedAlert.houseId,
    userId: session?.user.id,
    type: "UPDATE",
    entity: "ALERT",
    entityId: parseInt(alertId),
    title: `${session?.user.name} resolved an alert`,
    message: `${session?.user.name} marked ${updatedAlert.title} as resolved`,
  });
}

// undo resolved alert
export async function undoResolvedAlert(alertId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // update alert in db
  const updatedAlert = await prisma.alert.update({
    where: { id: alertId },
    data: { isResolved: false },
  });

  await logActivity({
    houseId: updatedAlert.houseId,
    userId: session?.user.id,
    type: "UPDATE",
    entity: "ALERT",
    entityId: parseInt(alertId),
    title: `${session?.user.name} unresolved an alert`,
    message: `${session?.user.name} marked ${updatedAlert.title} as unsolved`,
  });
}

// create a new alert
export async function createAlert(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("You must be logged in to create an alert.");
  }

  const user = await getUserById(session.user.id);

  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const priority = formData.get("priority") as
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";
  const expiresAtString = formData.get("expiresAt") as string | null;

  const expiresAt = expiresAtString ? new Date(expiresAtString) : null;

  const newAlert = await prisma.alert.create({
    data: {
      houseId: user!.houseId!,
      title,
      message,
      priority,
      expiresAt,
      createdById: session.user.id,
    },
  });

  await logActivity({
    houseId: newAlert.houseId,
    userId: session.user.id,
    type: "CREATE",
    entity: "ALERT",
    entityId: Number(newAlert.id),
    title: `${session.user.name} created a new alert`,
    message: `${session.user.name} created alert ${newAlert.title}`,
  });

  revalidatePath("/house");
}
