"use client";
import { useState } from "react";
import {
  Button,
  Accordion,
  AccordionItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Prisma } from "@/prisma/generated/browser";
import {
  Armchair,
  Bath,
  BedSingle,
  CookingPot,
  House,
  TreeDeciduous,
} from "lucide-react";
import TaskCard from "./task-card";
import CreateTask from "./create-task";
import MainButton from "@/app/_components/main-button";

type HouseProps = {
  house: Prisma.HouseGetPayload<{
    include: {
      users: true;
      tasks: {
        include: {
          room: {
            select: {
              name: true;
              roomType: true;
            };
          };
          assigned: {
            select: {
              name: true;
            };
          };
        };
      };
      rooms: {
        include: {
          tasks: {
            include: {
              room: {
                select: {
                  name: true;
                  roomType: true;
                };
              };
              assigned: {
                select: {
                  name: true;
                };
              };
            };
          };
        };
      };
    };
  }>;
};

export default function Tasks({ house }: HouseProps) {
  const [addTaskIsOpen, setAddTaskIsOpen] = useState(false);
  const [viewType, setViewType] = useState<"byRoom" | "All">("All");

  const defineRoomIcon = (roomType: string) => {
    switch (roomType) {
      case "LIVING_ROOM":
        return <Armchair />;
      case "KITCHEN":
        return <CookingPot />;
      case "BATHROOM":
        return <Bath />;
      case "BEDROOM":
        return <BedSingle />;
      case "EXTERNAL":
        return <TreeDeciduous />;
      case "OTHER":
        return <House />;
    }
  };

  return (
    <>
      <div className="flex items-center">
        <MainButton onClick={() => setAddTaskIsOpen(true)}>
          + New Task
        </MainButton>

        <CreateTask
          createTaskIsOpen={addTaskIsOpen}
          setCreateTaskIsOpen={setAddTaskIsOpen}
          users={house.users}
          rooms={house.rooms}
          houseId={house.id}
        />
      </div>

      <div className="container flex flex-col gap-4 flex-wrap items-end">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" size="sm">
              {viewType === "byRoom" ? "Tasks by Room" : "All Tasks"}
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="View Type"
            onAction={(key) => setViewType(key as typeof viewType)}
            selectionMode="single"
            selectedKeys={[viewType]}
          >
            <DropdownItem key="All">All Tasks</DropdownItem>
            <DropdownItem key="byRoom">Tasks by Room</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex flex-col gap-4">
        {viewType === "byRoom" ? (
          <Accordion>
            {house.rooms.map((room) => (
              <AccordionItem
                key={room.id}
                aria-label={room.name}
                title={room.name}
                startContent={defineRoomIcon(room.roomType)}
              >
                {room.tasks.length === 0 ? (
                  <p className="text-default-500">No tasks in this room.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-2">
                    {room.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </ul>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div>
            {house.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
