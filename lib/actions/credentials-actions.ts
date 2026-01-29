"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "../auth";
import { headers } from "next/dist/server/request/headers";

import { logActivity } from "../activity";
import { revalidatePath } from "next/cache";
import { encrypt, decrypt } from "../security/credentials-crypto";

export async function createCredential(FormData: FormData, houseId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (session.user.houseId !== houseId) {
    throw new Error("Not authorized in this house");
  }

  const title = FormData.get("label") as string;
  const type = FormData.get("type") as
    | "WIFI"
    | "APPLIANCE"
    | "SERVICE"
    | "OTHER";
  const email = FormData.get("email") as string;
  const username = FormData.get("username") as string;
  const password = FormData.get("password") as string;
  const encryptedPassword = password ? encrypt(password) : null;
  const url = FormData.get("url") as string;
  const notes = FormData.get("notes") as string;

  const newCredential = await prisma.houseCredential.create({
    data: {
      houseId: houseId,
      label: title,
      type: type,
      email: email,
      username: username,
      password: encryptedPassword,
      url: url,
      notes: notes,
    },
  });

  await logActivity({
    houseId: houseId,
    userId: session.user.id,
    type: "CREATE",
    entity: "CREDENTIAL",
    entityId: newCredential.id,
    title: `New credential "${newCredential.label}" added`,
    message: `A new credential "${newCredential.label}" has been added to the house.`,
  });

  revalidatePath("/house");
  return newCredential;
}

export async function deleteCredential(credentialId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const credential = await prisma.houseCredential.findUnique({
    where: { id: credentialId },
    select: { houseId: true },
  });

  if (credential?.houseId !== session.user.houseId) {
    throw new Error("Not authorized");
  }

  await prisma.houseCredential.delete({
    where: {
      id: credentialId,
    },
  });

  await logActivity({
    houseId: session.user.houseId!,
    userId: session.user.id,
    type: "DELETE",
    entity: "CREDENTIAL",
    entityId: credentialId,
    title: `Credential deleted`,
    message: `A credential has been deleted from the house.`,
  });

  revalidatePath("/house");
}

// Function to reveal (decrypt) the password of a credential
export async function revealCredentialPassword(credentialId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const credential = await prisma.houseCredential.findUnique({
    where: { id: credentialId },
    select: {
      password: true,
      houseId: true,
    },
  });

  if (credential?.houseId !== session.user.houseId) {
    throw new Error("Not authorized in this house");
  }

  if (!credential?.password) {
    throw new Error("Password not found");
  }
  revalidatePath("/house");
  return decrypt(credential.password);
}
