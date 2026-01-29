"use client";

import { Checkbox, Chip, Button, Link } from "@heroui/react";
import { House, Bath, Fence, BedDouble, CookingPot } from "lucide-react";
import { Prisma } from "@/prisma/generated/browser";
import { toggleTaskStatus } from "@/lib/actions/tasks-actions";
import MainButton from "@/app/_components/main-button";

type TasksProps = {
  houseTasks: Prisma.HouseGetPayload<{
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
  }>["tasks"];
};

export default function Tasks({ houseTasks }: TasksProps) {
  const toggleTaskStatusHandler = async (taskId: number) => {
    await toggleTaskStatus(taskId);
  };

  const defineRoomIcon = (roomType: string) => {
    switch (roomType) {
      case "LIVING_ROOM":
      case "OTHER":
        return <House size={15} />;
      case "BEDROOM":
        return <BedDouble size={15} />;
      case "BATHROOM":
        return <Bath size={15} />;
      case "EXTERNAL":
        return <Fence size={15} />;
      case "KITCHEN":
        return <CookingPot size={15} />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      {houseTasks.map((task) =>
        !task.status ? (
          <Checkbox
            key={task.id}
            lineThrough
            onChange={() => toggleTaskStatusHandler(task.id)}
            classNames={{
              base: "w-full justify-between max-w-none",
              label: "w-full max-w-none flex justify-between",
            }}
          >
            {task.title}{" "}
            <div className="flex items-center">
              {task.room && (
                <Chip key={task.room.name} size="sm" className="ml-2">
                  {defineRoomIcon(task.room.roomType)}
                </Chip>
              )}
              {task.assigned.map((user) => (
                <Chip key={user.name} size="sm" className="ml-2">
                  {user.name}
                </Chip>
              ))}
            </div>
          </Checkbox>
        ) : null,
      )}
      <MainButton href="/house/tasks">Go to All Tasks</MainButton>
    </div>
  );
}
