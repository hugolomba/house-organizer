"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // ou getServerSession
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function markShareAsPaid(billId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Encontra a share do user para esse bill
  const share = await prisma.share.findFirst({
    where: {
      billId,
      userId: session.user.id,
    },
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
  });

  revalidatePath("/house");

  return { success: true };
}
