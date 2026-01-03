"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import BillCard from "./(bill-components)/bill-card";
import { Prisma } from "@/prisma/generated/browser";
import { useState } from "react";
import CreateBill from "./(bill-components)/create-bill";

type HouseProps = {
  house: Prisma.HouseGetPayload<{
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
      users: true;
    };
  }>;
};

export default function Bills({ house }: HouseProps) {
  console.log("HOUSE BILLS:", house.bills);
  const [addBillIsOpen, setAddBillIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<
    "all" | "thisMonth" | "overdue" | "paid"
  >("all");
  const [search, setSearch] = useState("");

  const sortedBills = [...house.bills].sort((a, b) => {
    const aDate = new Date(a.dueDate).getTime();
    const bDate = new Date(b.dueDate).getTime();

    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  });

  const filteredBills = sortedBills
    .filter((bill) => {
      if (filter === "all") return true;
      if (filter === "overdue") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const billDate = new Date(bill.dueDate);
        billDate.setHours(0, 0, 0, 0);
        const unpaidCount = bill.shares.filter((s) => !s.paid).length;
        return billDate < today && unpaidCount > 0;
      }
      if (filter === "paid") {
        return bill.shares.every((share) => share.paid);
      }
      if (filter === "thisMonth") {
        const now = new Date();
        const billDate = new Date(bill.dueDate);
        return (
          billDate.getMonth() === now.getMonth() &&
          billDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    })
    .filter((bill) => {
      return (
        bill.title.toLowerCase().includes(search.toLowerCase()) ||
        bill.description?.toLowerCase().includes(search.toLowerCase()) ||
        bill.responsible.name.toLowerCase().includes(search.toLowerCase()) ||
        bill.totalValue.toString().includes(search)
      );
    });

  console.log("seacrh temp:", search);

  return (
    <>
      <div className="flex items-center">
        <Button color="default" onPress={() => setAddBillIsOpen(true)}>
          + New Bill
        </Button>

        <CreateBill
          createBillIsOpen={addBillIsOpen}
          setCreateBillIsOpen={setAddBillIsOpen}
          houseUsers={house.users}
          houseId={house.id}
        />
      </div>

      <Input
        placeholder="Search bills..."
        type="search"
        value={search}
        onValueChange={setSearch}
      />

      <div className="container flex flex-col gap-4">
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="flat"
            onPress={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "Due soonest ↑" : "Due latest ↓"}
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" size="sm">
                {filter === "all"
                  ? "All Bills"
                  : filter === "overdue"
                  ? "Overdue Bills"
                  : filter === "paid"
                  ? "Paid Bills"
                  : "Due This Month"}
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Filter Bills"
              onAction={(key) => setFilter(key as typeof filter)}
              selectionMode="single"
              selectedKeys={[filter]}
            >
              <DropdownItem key="all">All Bills</DropdownItem>
              <DropdownItem key="thisMonth">Due This Month</DropdownItem>
              <DropdownItem key="overdue">Overdue Bills</DropdownItem>
              <DropdownItem key="paid">Paid Bills</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex flex-col gap-4">
          {filteredBills.length === 0 ? (
            <p className="text-center text-default-500 mt-4">
              No bills found! 🎉
            </p>
          ) : (
            filteredBills.map((bill) => <BillCard key={bill.id} bill={bill} />)
          )}
        </div>
      </div>
    </>
  );
}
