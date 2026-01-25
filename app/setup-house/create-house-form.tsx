"use client";
import {
  Button,
  Form,
  Input,
  Alert,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
} from "@heroui/react";
import { CircleCheckBig, HousePlus, Copy, CopyCheck } from "lucide-react";
import { createHouse } from "@/lib/actions/house-actions";
import { useState } from "react";
import { House } from "@/prisma/generated/browser";

export default function CreateHouseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [createdHouse, setCreatedHouse] = useState<House | null>(null);
  const { onOpenChange } = useDisclosure();
  const [isCreated, setIsCreated] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const house = await createHouse({ name, address, imageUrl });
      if (house) {
        setCreatedHouse(house);
      }
    } catch (error) {
      setErrorMessage(String(error));
      setIsVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy invite link to clipboard
  const handleCopyInvite = () => {
    if (!createdHouse) return;

    navigator.clipboard
      .writeText(createdHouse.inviteCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 5000);
      })
      .catch((err) => {
        console.error("Failed to copy invite link:", err);
      });
  };

  return (
    <>
      {!createdHouse ? (
        <div className="flex flex-col items-center gap-8 w-full max-w-md p-8">
          <div className="w-[90%] absolute top-5">
            <Alert
              color="danger"
              description={
                errorMessage || "An error occurred while creating the house."
              }
              isVisible={isVisible}
              title="Error"
              variant="faded"
              onClose={() => setIsVisible(false)}
            />
          </div>

          <HousePlus size={64} />

          <Form
            className="w-full flex flex-col gap-4 items-center"
            onSubmit={handleSubmit}
          >
            <Input
              label="House Name"
              placeholder="Name of your house"
              labelPlacement="outside"
              required
              size="lg"
              onValueChange={setName}
            />
            <Input
              label="Adress"
              placeholder="Define your house adress"
              labelPlacement="outside"
              size="lg"
              onValueChange={setAddress}
            />
            {isSubmitting ? (
              <Button
                isLoading
                type="submit"
                size="lg"
                variant="solid"
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-white font-semibold mt-4"
              >
                Creating House
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                variant="solid"
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-white font-semibold mt-4"
              >
                Create House
              </Button>
            )}
          </Form>
        </div>
      ) : (
        <Modal
          isOpen={isCreated}
          onOpenChange={onOpenChange}
          backdrop="blur"
          placement="center"
        >
          <ModalContent>
            <ModalHeader className="items-center"></ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center gap-4">
                <CircleCheckBig size={36} />
                <h2 className="text-xl font-bold">House Created!</h2>
                <p className="text-center">
                  Your house{" "}
                  <span className="font-bold">{createdHouse?.name}</span> on{" "}
                  <span className="font-bold">{createdHouse?.address}</span> has
                  been created successfully.
                </p>
                <h3 className="text-md">
                  Use your house code to invite your housemates to join!
                </h3>
                <div className=" p-4 rounded w-full break-all text-center">
                  <p className="text-foreground font-mono text-sm">
                    {createdHouse?.inviteCode}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-white font-semibold"
                  variant="solid"
                  onPress={handleCopyInvite}
                  startContent={copied ? <CopyCheck /> : <Copy />}
                >
                  {copied ? "Code Copied!" : "Copy Code"}
                </Button>
              </div>
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button
                as={Link}
                href="/house"
                variant="solid"
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-white font-semibold"
              >
                Go to my House
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
