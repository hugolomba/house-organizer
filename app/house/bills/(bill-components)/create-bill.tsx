"use client";

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
  NumberInput,
  CheckboxGroup,
  Checkbox,
  Avatar,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";
import { createBill } from "@/lib/actions/bills-actions";

export default function CreateBill({
  createBillIsOpen,
  setCreateBillIsOpen,
  houseUsers,
  houseId,
}: {
  createBillIsOpen: boolean;
  setCreateBillIsOpen: (open: boolean) => void;
  houseUsers: Array<{ id: string; name: string; image: string | null }>;
  houseId: number;
}) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [splitAmong, setSplitAmong] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      //   await createAlert(formData);
      await createBill(formData, houseId); // Replace 1 with actual houseId
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitted(true);
      setIsSubmitting(false);
      setSplitAmong([]);
      setTotalAmount(0);
    }
  };

  return (
    <Modal
      isOpen={createBillIsOpen}
      onOpenChange={setCreateBillIsOpen}
      placement="center"
    >
      <ModalContent className="p-4">
        <ModalHeader>
          {!isSubmitting ? "Create Bill" : "Bill Created Successfully"}
        </ModalHeader>
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
              label="Description"
              labelPlacement="outside"
              name="description"
              placeholder="Enter the bill description"
              type="text"
            />

            <DatePicker name="dueDate" label="Due Date" />

            <NumberInput
              label="Total Amount"
              name="totalValue"
              isRequired
              value={totalAmount}
              onValueChange={setTotalAmount}
              formatOptions={{
                style: "currency",
                currency: "EUR",
              }}
              isClearable
            />

            <Select label="Responsible to Pay" name="responsibleId" isRequired>
              {houseUsers.map((user) => (
                <SelectItem key={user.id}>{user.name}</SelectItem>
              ))}
            </Select>

            <CheckboxGroup
              classNames={{
                wrapper: "flex flex-row gap-4",
                label: "flex flex-col",
              }}
              label={`Split Among (${splitAmong.length} members) ${
                splitAmong.length > 0 && totalAmount > 0
                  ? `€${(totalAmount / splitAmong.length).toFixed(2)} each`
                  : ``
              } `}
              name="shares"
              value={splitAmong}
              onValueChange={setSplitAmong}
            >
              {houseUsers.map((user) => (
                <Checkbox
                  key={user.id}
                  value={user.id}
                  className="flex flex-col-reverse justify-center items-center"
                  isDisabled={totalAmount <= 0}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Avatar
                      size="sm"
                      src={user.image || undefined}
                      className="mr-2"
                    />
                    {user.name}
                  </div>
                </Checkbox>
              ))}
            </CheckboxGroup>

            <Button type="submit" variant="bordered" isLoading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Bill"}
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
              variant="flat"
              onPress={() => {
                setSubmitted(false);
                setCreateBillIsOpen(false);
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
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
