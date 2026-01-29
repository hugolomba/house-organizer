"use client";
import { createRoom } from "@/lib/actions/rooms-actions";
import { Prisma } from "@/prisma/generated/client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Switch,
  CheckboxGroup,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
// import { createRoom } from "@/lib/actions/rooms-actions";

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

export default function CreateRoom({
  createRoomIsOpen,
  setCreateRoomIsOpen,
  house,
}: {
  createRoomIsOpen: boolean;
  setCreateRoomIsOpen: (open: boolean) => void;
  house: HouseProps["house"];
}) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCommon, setIsCommon] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await createRoom(formData, isCommon, house.id, selectedUsers);
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={createRoomIsOpen}
      onOpenChange={setCreateRoomIsOpen}
      placement="center"
    >
      <ModalContent className="p-4">
        <ModalHeader>
          {!submitted ? "Create Room" : "Room Created Successfully"}
        </ModalHeader>

        {!submitted ? (
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Room Name"
              labelPlacement="outside"
              name="name"
              placeholder="Enter the room name"
              type="text"
              maxLength={50}
            />
            <Switch onValueChange={setIsCommon} name="isCommon">
              Common Room
            </Switch>

            {!isCommon && (
              <CheckboxGroup
                //    defaultValue={}
                value={selectedUsers}
                onValueChange={setSelectedUsers}
                label="Select users with access to this room"
              >
                {house.users.map((user) => (
                  <Checkbox key={user.id} value={user.id}>
                    {user.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}

            <Select label="Room Type" name="roomType" isRequired>
              <SelectItem key="LIVING_ROOM">Living Room</SelectItem>
              <SelectItem key="KITCHEN">Kitchen</SelectItem>
              <SelectItem key="BATHROOM">Bathroom</SelectItem>
              <SelectItem key="BEDROOM">Bedroom</SelectItem>
              <SelectItem key="EXTERNAL">External</SelectItem>
              <SelectItem key="OTHER">Other</SelectItem>
            </Select>

            {error && <p className="text-small text-danger">{error}</p>}

            <Button type="submit" variant="bordered" isLoading={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Room"}
            </Button>
          </Form>
        ) : (
          <ModalFooter className="mt-4 flex gap-2">
            <Button
              variant="flat"
              onPress={() => {
                setSubmitted(false);
                setCreateRoomIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              variant="flat"
              onPress={() => {
                setSubmitted(false);
              }}
            >
              Create Another Room
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
