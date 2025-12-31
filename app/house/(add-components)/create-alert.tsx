"use client";

import { createAlert } from "@/lib/actions/alerts-actions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";

export default function CreateAlert({
  createAlertIsOpen,
  setCreateAlertIsOpen,
}: {
  createAlertIsOpen: boolean;
  setCreateAlertIsOpen: (open: boolean) => void;
}) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      await createAlert(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitted(true);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={createAlertIsOpen}
      onOpenChange={setCreateAlertIsOpen}
      placement="center"
    >
      <ModalContent className="p-4">
        <ModalHeader>Create Alert</ModalHeader>
        {!submitted ? (
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              errorMessage="Please enter a valid title"
              label="Title"
              labelPlacement="outside"
              name="title"
              placeholder="Enter the alert title"
              type="text"
              maxLength={50}
            />
            <Input
              isRequired
              errorMessage="Please enter a valid title"
              label="Message"
              labelPlacement="outside"
              name="message"
              placeholder="Enter the alert message"
              type="text"
            />
            <Select name="priority" label="Priority" isRequired>
              <SelectItem key="LOW">Low</SelectItem>
              <SelectItem key="MEDIUM">Medium</SelectItem>
              <SelectItem key="HIGH">High</SelectItem>
              <SelectItem key="URGENT">Urgent</SelectItem>
            </Select>

            <DatePicker name="expiresAt" label="Expiring Date" />

            <Button type="submit" variant="bordered" isLoading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Alert"}
            </Button>
            {submitted && (
              <div className="text-small text-default-500">
                You submitted: <code>{JSON.stringify(submitted)}</code>
              </div>
            )}
          </Form>
        ) : (
          <div className="p-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p>Alert created successfully!</p>
            )}
            <Button
              variant="flat"
              onPress={() => {
                setSubmitted(false);
                setCreateAlertIsOpen(false);
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
              Create Another Alert
            </Button>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
