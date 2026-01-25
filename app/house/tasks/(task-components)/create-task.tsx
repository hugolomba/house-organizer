"use client";

import MainButton from "@/app/_components/main-button";
import { createTask } from "@/lib/actions/tasks-actions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Form,
  Input,
  Select,
  SelectItem,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";

interface CreateTaskProps {
  createTaskIsOpen: boolean;
  setCreateTaskIsOpen: (open: boolean) => void;
  rooms: { id: number; name: string }[];
  users: { id: string; name: string }[];
  houseId: number;
}

export default function CreateTask({
  createTaskIsOpen,
  setCreateTaskIsOpen,
  rooms,
  users,
  houseId,
}: CreateTaskProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createTask(formData, houseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={createTaskIsOpen}
      onOpenChange={setCreateTaskIsOpen}
      placement="center"
    >
      <ModalContent className="p-4">
        <ModalHeader>
          {!submitted ? "Create Task" : "Task Created Successfully"}
        </ModalHeader>

        {!submitted ? (
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Title"
              labelPlacement="outside"
              name="title"
              placeholder="Enter task title"
              type="text"
              maxLength={50}
            />
            <Input
              label="Description"
              labelPlacement="outside"
              name="description"
              placeholder="Optional description"
              type="text"
            />

            {rooms.length > 0 && (
              <Select name="roomId" label="Room">
                {rooms.map((room) => (
                  <SelectItem key={room.id}>{room.name}</SelectItem>
                ))}
              </Select>
            )}
            <Select isRequired name="assignedIds" label="Assign Users" multiple>
              {users.map((user) => (
                <SelectItem key={user.id}>{user.name}</SelectItem>
              ))}
            </Select>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <MainButton type="submit" isLoading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Task"}
            </MainButton>
          </Form>
        ) : (
          <ModalFooter className="mt-4 flex gap-2">
            <MainButton
              onClick={() => {
                setSubmitted(false);
                setCreateTaskIsOpen(false);
              }}
            >
              Close
            </MainButton>
            <MainButton onClick={() => setSubmitted(false)}>
              Create Another Task
            </MainButton>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
