"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// mark an alert as solved
export async function markAlertAsResolved(alertId: string) {
  // update alert in db
  await prisma.alert.update({
    where: { id: alertId },
    data: { isResolved: true },
  });
}

// undo resolved alert
export async function undoResolvedAlert(alertId: string) {
  // update alert in db
  await prisma.alert.update({
    where: { id: alertId },
    data: { isResolved: false },
  });
}

// get house by house id
