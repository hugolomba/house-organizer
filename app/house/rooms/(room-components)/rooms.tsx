"use client";
import { Prisma } from "@/prisma/generated/client";
import { Avatar } from "@heroui/react";
import TaskCard from "../../tasks/(task-components)/task-card";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import RoomCard from "./room-card";
import CreateRoom from "./create-room";
import { deleteRoom } from "@/lib/actions/rooms-actions";
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
          users: true;
        };
      };
    };
  }>;
};

export default function HouseRooms({ house }: HouseProps) {
  const [addRoomIsOpen, setAddRoomIsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<
    HouseProps["house"]["rooms"][number] | null
  >(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRoom = async (roomId: number) => {
    try {
      setIsDeleting(true);

      await deleteRoom(roomId);

      setDeleteModalIsOpen(false);
      setIsModalOpen(false);
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <MainButton onClick={() => setAddRoomIsOpen(true)}>
          + New Room
        </MainButton>

        <CreateRoom
          createRoomIsOpen={addRoomIsOpen}
          setCreateRoomIsOpen={setAddRoomIsOpen}
          house={house}
        />
      </div>

      <div className="flex flex-col gap-4">
        {house.rooms.length === 0 ? (
          <p className="text-md text-default-500">No rooms available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {house.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => {
                  setSelectedRoom(room);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          backdrop="blur"
          placement="center"
        >
          <ModalContent>
            <ModalHeader className="text-xl">{selectedRoom?.name}</ModalHeader>
            <ModalBody>
              {selectedRoom && (
                <div className="flex flex-col gap-3">
                  <p>
                    <strong>Type:</strong> {selectedRoom.roomType}
                  </p>

                  <Divider />

                  <p className="font-semibold">Users</p>
                  {selectedRoom.isCommon ? (
                    <p className="text-default-500">
                      Common space — all house members
                    </p>
                  ) : (
                    selectedRoom.users.map((user) => (
                      <div key={user.id} className="flex items-center gap-2">
                        <Avatar size="sm" src={user.image || ""} />
                        <span>{user.name}</span>
                      </div>
                    ))
                  )}

                  <Divider />

                  <p className="font-semibold">Tasks</p>
                  {selectedRoom.tasks.length === 0 ? (
                    <p className="text-default-500">No tasks.</p>
                  ) : (
                    selectedRoom.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  setDeleteModalIsOpen(true);
                }}
              >
                Delete Room
              </Button>
              <Button variant="flat" onPress={() => setIsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* delete modal */}
        <Modal
          isOpen={deleteModalIsOpen}
          onOpenChange={setDeleteModalIsOpen}
          backdrop="blur"
          placement="center"
        >
          <ModalContent>
            <ModalHeader className="text-xl">Delete Room</ModalHeader>
            <ModalBody>
              Are you sure you want to delete the room &quot;
              {selectedRoom?.name}&quot;? This action cannot be undone.
              <span className="block mt-2 text-sm text-default-500">
                All tasks associated with this room will also be deleted.
              </span>
            </ModalBody>
            <ModalFooter>
              <MainButton onClick={() => setDeleteModalIsOpen(false)}>
                Cancel
              </MainButton>
              <MainButton
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  handleDeleteRoom(selectedRoom!.id);
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </MainButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
