"use client";
import { Form, Input, RadioGroup, Radio, Button } from "@heroui/react";
import { useState } from "react";
import { createCredential } from "@/lib/actions/credentials-actions";
import MainButton from "@/app/_components/main-button";

export default function AddCredential({
  setAddCredentialIsOpen,
  houseId,
}: {
  setAddCredentialIsOpen: (isOpen: boolean) => void;
  houseId: number;
}) {
  const [isCreated, setIsCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const newCredential = await createCredential(formData, houseId);
      setIsCreated(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full px-4 flex flex-col items-center">
      {isCreated ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-600">Credential added successfully!</p>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setAddCredentialIsOpen(false)}
          >
            Back to Credentials
          </Button>
          <Button size="sm" variant="flat" onPress={() => setIsCreated(false)}>
            Create Another Credential
          </Button>
        </div>
      ) : (
        <div className="max-w-md w-full">
          <h2 className="text-lg font-medium mb-4">Add New Credential</h2>
          {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}
          <Form className="w-full" onSubmit={handleCreateCredential}>
            <Input label="Name" name="label" isRequired size="sm" />
            <RadioGroup
              label="Type of Credential"
              name="type"
              orientation="horizontal"
              className="mt-2"
              isRequired
            >
              <Radio value="WIFI">Wi‑Fi</Radio>
              <Radio value="APPLIANCE">Appliance</Radio>
              <Radio value="SERVICE">Service</Radio>
              <Radio value="OTHER">Other</Radio>
            </RadioGroup>
            <Input label="Email" name="email" size="sm" />
            <Input label="Username" name="username" size="sm" />
            <Input label="Password" name="password" type="password" size="sm" />
            <Input label="URL" name="url" size="sm" />
            <Input label="Notes" name="notes" type="text" size="sm" />

            <div className="flex flex-row gap-4 mt-4">
              <MainButton
                type="submit"
                // onPress={(e) => handleCreateCredential(e as React.FormEvent<HTMLFormElement>)}
              >
                Add Credential
              </MainButton>
              <MainButton
                className="p-0 bg-gray-600 text-black hover:bg-gray-300"
                onClick={() => setAddCredentialIsOpen(false)}
              >
                Back to Credentials
              </MainButton>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
