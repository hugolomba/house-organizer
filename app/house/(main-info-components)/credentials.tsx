"use client";

import {
  deleteCredential,
  revealCredentialPassword,
} from "@/lib/actions/credentials-actions";
import { Prisma } from "@/prisma/generated/browser";
import { Accordion, AccordionItem, Button, Chip, Input } from "@heroui/react";
import {
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  HousePlug,
  RectangleEllipsis,
  Toolbox,
  Trash,
  Wifi,
} from "lucide-react";
import { useState } from "react";

export default function Credentials({
  houseCredentials,
}: {
  houseCredentials: Prisma.HouseGetPayload<{
    include: {
      credentials: true;
    };
  }>["credentials"];
}) {
  const [visiblePasswordId, setVisiblePasswordId] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [decryptedPasswords, setDecryptedPasswords] = useState<
    Record<number, string>
  >({});

  const sortedCredentials = [...houseCredentials].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  const handleDelete = async (credentialId: number) => {
    setIsDeleting(true);
    await deleteCredential(credentialId);
    setIsDeleting(false);
  };

  const handleShowAndDecryptPassword = async (credentialId: number) => {
    if (!decryptedPasswords[credentialId]) {
      const password = await revealCredentialPassword(credentialId);
      setDecryptedPasswords((prev) => ({
        ...prev,
        [credentialId]: password,
      }));
    }

    setVisiblePasswordId((prev) =>
      prev === credentialId ? null : credentialId,
    );
  };

  // function to decide icon to appliance type
  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "wifi":
        return <Wifi size={18} />;
      case "appliance":
        return <HousePlug size={18} />;

      case "service":
        return <Toolbox size={18} />;

      case "other":
        return <RectangleEllipsis size={18} />;
      default:
        return <RectangleEllipsis size={18} />;
    }
  };

  return (
    <Accordion
      variant="splitted"
      isCompact
      itemClasses={{
        titleWrapper: "flex flex-row justify-between",
        content: "py-2 pb-4",
      }}
    >
      {sortedCredentials.map((credential) => (
        <AccordionItem
          key={credential.id}
          title={<span className="font-medium">{credential.label}</span>}
          subtitle={
            <Chip
              size="sm"
              variant="flat"
              endContent={getIconForType(credential.type)}
            >
              {credential.type}
            </Chip>
          }
        >
          <div className="space-y-3">
            {credential.email && (
              <Input
                label="Email"
                value={credential.email}
                readOnly
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleCopy(credential.email!)}
                  >
                    <Copy size={16} />
                  </Button>
                }
              />
            )}

            {credential.username && (
              <Input
                label="Username"
                value={credential.username}
                readOnly
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleCopy(credential.username!)}
                  >
                    <Copy size={16} />
                  </Button>
                }
              />
            )}

            {credential.password && (
              <Input
                label="Password"
                type={visiblePasswordId === credential.id ? "text" : "password"}
                value={
                  visiblePasswordId === credential.id
                    ? (decryptedPasswords[credential.id] ?? "")
                    : ""
                }
                readOnly
                placeholder="••••••••"
                endContent={
                  <div className="flex items-center gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() =>
                        handleShowAndDecryptPassword(credential.id)
                      }
                    >
                      {visiblePasswordId === credential.id ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>

                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() =>
                        handleCopy(decryptedPasswords[credential.id] || "")
                      }
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                }
              />
            )}

            {credential.url && (
              <Button
                as="a"
                href={credential.url}
                target="_blank"
                variant="flat"
                startContent={<ExternalLink size={16} />}
              >
                Open website
              </Button>
            )}

            {credential.notes && (
              <div className="rounded-lg bg-default-100 p-3 text-sm text-default-700">
                {credential.notes}
              </div>
            )}
          </div>
          <Button
            color="danger"
            size="sm"
            isLoading={isDeleting}
            startContent={<Trash size={16} />}
            className="mt-4"
            onPress={() => handleDelete(credential.id)}
          >
            {isDeleting ? "Deleting..." : "Delete Credential"}
          </Button>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
