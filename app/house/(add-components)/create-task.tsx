"use client";

import { createTask } from "@/lib/actions/tasks-actions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Form,
  Input,
  Button,
  Select,
  SelectItem,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";

interface CreateTaskProps {
  createTaskIsOpen: boolean;
  setCreateTaskIsOpen: (open: boolean) => void;
  rooms: { id: number; name: string }[]; // Lista de salas disponíveis
  users: { id: string; name: string }[]; // Lista de usuários possíveis para assign
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

            <Select isRequired name="roomId" label="Select Room">
              {rooms.map((room) => (
                <SelectItem key={room.id}>{room.name}</SelectItem>
              ))}
            </Select>

            <Select isRequired name="assignedIds" label="Assign Users" multiple>
              {users.map((user) => (
                <SelectItem key={user.id}>{user.name}</SelectItem>
              ))}
            </Select>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" variant="bordered" isLoading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Task"}
            </Button>
          </Form>
        ) : (
          <ModalFooter className="mt-4 flex gap-2">
            <Button
              variant="flat"
              onPress={() => {
                setSubmitted(false);
                setCreateTaskIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button variant="flat" onPress={() => setSubmitted(false)}>
              Create Another Task
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
