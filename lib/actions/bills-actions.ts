"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { logActivity } from "../activity";

export async function markShareAsPaid(billId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Find the share for the current user and bill
  const share = await prisma.share.findFirst({
    where: {
      billId,
      userId: session.user.id,
    },
    include: { bill: true },
  });

  if (!share) {
    throw new Error("Share not found for this user");
  }

  if (share.paid) {
    return { success: true };
  }

  await prisma.share.update({
    where: { id: share.id },
    data: { paid: true },
    include: { bill: true },
  });

  await logActivity({
    houseId: share.bill.houseId,
    userId: session.user.id,
    type: "UPDATE",
    entity: "SHARE",
    entityId: share.bill.id,
    title: `${session.user.name} marked a share as paid`,
    message: `${session.user.name} marked the share for bill ${share.bill.title} as paid`,
  });

  revalidatePath("/house");

  return { success: true };
}

// mark all shares as paid for a bill
export async function markAllSharesAsPaid(billId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  const shares = await prisma.share.updateMany({
    where: { billId },
    data: { paid: true },
  });

  await logActivity({
    houseId: bill?.houseId,
    userId: session.user.id,
    type: "UPDATE",
    entity: "SHARE",
    entityId: billId,
    title: `${session.user.name} marked all shares as paid`,
    message: `${session.user.name} marked all shares for bill ID ${billId} as paid`,
  });

  revalidatePath("/house");
  revalidatePath("/house/bills");

  return { success: true };
}

// Create a bill
export async function createBill(formData: FormData, houseId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const rawTotalValue = formData.get("totalValue")?.toString() ?? "";
  const totalValue = Number(rawTotalValue.replace(",", "."));

  const dueDate = new Date(formData.get("dueDate") as string);
  const responsibleId = formData.get("responsibleId") as string;
  const shareUserIds = formData.getAll("shares").map((id) => id.toString());

  const bill = await prisma.bill.create({
    data: {
      title,
      description,
      totalValue,
      dueDate,
      houseId,
      responsibleId,
      shares: {
        create: shareUserIds.map((userId) => ({
          userId,
          value: totalValue / shareUserIds.length,
        })),
      },
    },
    include: { shares: true },
  });

  await logActivity({
    houseId: bill.houseId,
    userId: session.user.id,
    type: "CREATE",
    entity: "BILL",
    entityId: bill.id,
    title: `${session.user.name} created a new bill`,
    message: `${session.user.name} created the bill ${
      bill.title
    } with amount $${bill.totalValue.toFixed(2)}`,
  });

  revalidatePath("/house");
  revalidatePath("/house/bills");

  return bill;
}

// get bills by house id
export async function getBillsByHouseId(houseId: number) {
  const bills = await prisma.bill.findMany({
    where: { houseId },
    include: {
      shares: {
        include: { user: true },
      },
      responsible: true,
    },
  });

  return bills;
}

// Delete a bill
export async function deleteBill(billId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  await prisma.$transaction([
    prisma.share.deleteMany({
      where: { billId },
    }),
    prisma.bill.delete({
      where: { id: billId },
    }),
  ]);

  await logActivity({
    houseId: bill.houseId,
    userId: session.user.id,
    type: "UPDATE",
    entity: "BILL",
    entityId: billId,
    title: `${session.user.name} deleted a bill`,
    message: `${session.user.name} deleted the bill ${bill.title}`,
  });

  revalidatePath("/house");
  revalidatePath("/house/bills");

  return { success: true };
}
