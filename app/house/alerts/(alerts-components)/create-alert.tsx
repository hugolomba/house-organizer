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
  ModalFooter,
} from "@heroui/react";
import { sub } from "framer-motion/client";
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
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setError(null);
      await createAlert(formData);
      setSuccess(true);
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      setSuccess(false);
    } finally {
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
        <ModalHeader>
          {!submitted
            ? "Create Alert"
            : success
              ? "Alert Created Successfully"
              : "Error Creating Alert"}
        </ModalHeader>
        {!submitted || !success ? (
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

            {error && <div className="text-small text-red-500">{error}</div>}

            <Button
              type="submit"
              className="rounded-full bg-blue-600 dark:bg-gray-800 text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Alert"}
            </Button>
            {submitted && (
              <div className="text-small text-default-500">
                You submitted: <code>{JSON.stringify(submitted)}</code>
              </div>
            )}
          </Form>
        ) : (
          <ModalFooter className="mt-4 flex gap-2">
            <Button
              className="rounded-full bg-blue-600 dark:bg-gray-800 text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
              onPress={() => {
                setSubmitted(false);
                setSuccess(false);
                setError(null);
                setCreateAlertIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              className="rounded-full bg-blue-600 dark:bg-gray-800 text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
              onPress={() => {
                setSubmitted(false);
                setSuccess(false);
                setError(null);
              }}
            >
              Create Another Alert
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
