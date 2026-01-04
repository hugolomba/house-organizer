"use client";
import { Prisma } from "@/prisma/generated/browser";
import CreateBill from "../../bills/(bill-components)/create-bill";
import CreateAlert from "./create-alert";
import { Alert, Button } from "@heroui/react";
import AlertCard from "./alert-card";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

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
      alerts: true;
    };
  }>;
};

export default function Bills({ house }: HouseProps) {
  const [createAlertIsOpen, setCreateAlertIsOpen] = useState(false);
  const [filter, setFilter] = useState<
    "low" | "medium" | "high" | "urgent" | "all"
  >("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [solvedOrUnsolved, setSolvedOrUnsolved] = useState<
    "solved" | "unsolved"
  >("unsolved");
  const [search, setSearch] = useState("");

  const sortedAlerts = [...house.alerts].sort((a, b) => {
    const aDate = new Date(a.createdAt).getTime();
    const bDate = new Date(b.createdAt).getTime();

    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  });

  const filteredAlerts = sortedAlerts
    .filter((alert) => {
      if (filter === "all") return true;
      if (filter === "low") {
        return alert.priority === "LOW";
      }
      if (filter === "medium") {
        return alert.priority === "MEDIUM";
      }
      if (filter === "high") {
        return alert.priority === "HIGH";
      }
      if (filter === "urgent") {
        return alert.priority === "URGENT";
      }
    })
    .filter((alert) => {
      if (solvedOrUnsolved === "solved") {
        return alert.isResolved;
      }
      return !alert.isResolved;
    })
    .filter((bill) => {
      return (
        bill.title.toLowerCase().includes(search.toLowerCase()) ||
        bill.message?.toLowerCase().includes(search.toLowerCase()) ||
        bill.priority.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <>
      <div className="flex items-center">
        <Button
          color="default"
          size="sm"
          onPress={() => setCreateAlertIsOpen(true)}
        >
          + New Alert
        </Button>

        <CreateAlert
          createAlertIsOpen={createAlertIsOpen}
          setCreateAlertIsOpen={setCreateAlertIsOpen}
        />
      </div>

      <div className="container flex flex-col gap-4">
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="flat"
            color={solvedOrUnsolved === "solved" ? "success" : "danger"}
            onPress={() =>
              setSolvedOrUnsolved((prev) =>
                prev === "solved" ? "unsolved" : "solved"
              )
            }
          >
            {solvedOrUnsolved === "solved" ? "Solved" : "Unsolved"}
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "Newest ↑" : "Oldest ↓"}
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" size="sm">
                {filter === "all"
                  ? "All Alerts"
                  : filter === "low"
                  ? "Low Priority"
                  : filter === "medium"
                  ? "Medium Priority"
                  : filter === "high"
                  ? "High Priority"
                  : filter === "urgent"
                  ? "Urgent Priority"
                  : "All Alerts"}
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Filter Bills"
              onAction={(key) => setFilter(key as typeof filter)}
              selectionMode="single"
              selectedKeys={[filter]}
            >
              <DropdownItem key="all">All Alerts</DropdownItem>
              <DropdownItem key="low">Low Priority</DropdownItem>
              <DropdownItem key="medium">Medium Priority</DropdownItem>
              <DropdownItem key="high">High Priority</DropdownItem>
              <DropdownItem key="urgent">Urgent Priority</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="flex flex-col gap-4">
          {filteredAlerts.length === 0 ? (
            <p className="text-center text-default-500 mt-4">
              No alerts found! 🎉
            </p>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
