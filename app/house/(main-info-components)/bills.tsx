"use client";

import { Prisma } from "@/prisma/generated/browser";
import { Button } from "@heroui/react";
import Link from "next/link";
import BillCard from "../bills/(bill-components)/bill-card";
import MainButton from "@/app/_components/main-button";

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
  const UPCOMING_DAYS = 7;
  const upcomingBills = houseBills.filter((bill) => {
    const now = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffInDays =
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= UPCOMING_DAYS;
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm">
        You are seeing the upcoming bills within the next {UPCOMING_DAYS} days.
      </p>
      {upcomingBills.length === 0 && (
        <p className="text-md text-default-500">No upcoming bills.</p>
      )}
      {upcomingBills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}

      <MainButton href="/house/bills">View All Bills</MainButton>
    </div>
  );
}
