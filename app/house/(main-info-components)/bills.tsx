"use client";

import { markShareAsPaid } from "@/lib/actions/bills-actions";
import { Prisma } from "@/prisma/generated/browser";
import { useTransition, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Chip,
  AvatarGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from "@heroui/react";
import Link from "next/link";

type HouseBills = Prisma.HouseGetPayload<{
  include: {
    bills: {
      include: {
        shares: {
          include: {
            user: true;
          };
        };
        responsible: true;
      };
    };
  };
}>["bills"];

export default function Bills({ houseBills }: { houseBills: HouseBills }) {
  const [isPending, startTransition] = useTransition();
  const [selectedBill, setSelectedBill] = useState<HouseBills[number] | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter upcoming bills within the next 7 days
  const UPCOMING_DAYS = 7;
  const upcomingBills = houseBills.filter((bill) => {
    const now = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffInDays =
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= UPCOMING_DAYS;
  });

  const getDueLabel = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffInDays =
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 0) return "Overdue";
    if (diffInDays === 0) return "Due today";
    if (diffInDays === 1) return "Due in 1 day";

    return `Due in ${diffInDays} days`;
  };

  const handleMarkAsPaid = (billId: number) => {
    startTransition(() => {
      markShareAsPaid(billId);
      setSelectedBill((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          shares: prev.shares.map((share) =>
            share.userId === prev.responsibleId
              ? { ...share, paid: true }
              : share
          ),
        };
      });
    });
  };

  const userShare = selectedBill?.shares.find(
    (share) => share.userId === selectedBill.responsibleId
  );

  return (
    <div className="flex flex-col gap-2">
      {upcomingBills.map((bill) => (
        <Card
          key={bill.id}
          fullWidth
          shadow="sm"
          isPressable
          onPress={() => {
            setSelectedBill(bill);
            setIsModalOpen(true);
          }}
        >
          <CardHeader className="flex justify-between">
            <span className="font-bold">{bill.title}</span>
            <span className="font-semibold">
              {getDueLabel(new Date(bill.dueDate))}
            </span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-md text-muted-foreground">
                <span className="font-semibold">Total Amount:</span>
                <span>€ {bill.totalValue}</span>
              </p>
              <AvatarGroup className=" mt-2 mb-2">
                {bill.shares.map((share) => (
                  <Avatar
                    key={share.id}
                    className="w-6 h-6"
                    size="sm"
                    src={share.user?.image || ""}
                    isBordered
                    color={share.paid ? "success" : "danger"}
                  />
                ))}
              </AvatarGroup>
              <p className="text-sm text-muted-foreground">
                {bill.shares.every((share) => share.paid)
                  ? "All shares paid"
                  : `${bill.shares.filter((share) => share.paid).length} of ${
                      bill.shares.length
                    } shares paid`}
              </p>
            </div>
          </CardBody>
          <CardFooter className="flex justify-center"></CardFooter>
        </Card>
      ))}

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} backdrop="blur">
        <ModalContent>
          <ModalHeader className="text-xl">{selectedBill?.title}</ModalHeader>
          <ModalBody>
            {selectedBill && (
              <div className="flex flex-col gap-2">
                <p>
                  <strong>Description:</strong> {selectedBill.description}
                </p>
                <p>
                  <strong>Total:</strong> € {selectedBill.totalValue}
                </p>
                <p>
                  <strong>Due date:</strong>{" "}
                  {new Date(selectedBill.dueDate).toLocaleDateString()}
                </p>
                <div className="flex flex-row items-center gap-2">
                  <strong>Responsible:</strong>{" "}
                  {selectedBill.responsible?.name || "N/A"}
                  <Avatar
                    size="sm"
                    src={selectedBill.responsible?.image || ""}
                  />
                </div>

                <Divider />

                <p className="font-semibold">Shares</p>
                {selectedBill.shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar size="sm" src={share.user?.image || ""} />
                      <span>{share.user?.name}</span>
                    </div>
                    <Chip color={share.paid ? "success" : "danger"} size="sm">
                      {share.paid ? "Paid" : "Pending"}
                    </Chip>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              as={Link}
              href="/house/bills"
              variant="flat"
              color="primary"
              onPress={() => setIsModalOpen(false)}
            >
              Go to All Bills
            </Button>
            {userShare && !userShare.paid && (
              <Button
                isLoading={isPending}
                variant="flat"
                color="primary"
                onPress={() => {
                  handleMarkAsPaid(selectedBill!.id);
                }}
              >
                {isPending ? "Marking as Paid..." : "Mark Your Part as Paid"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
