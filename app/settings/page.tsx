"use client";

import { redirect, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { DoorOpen, House, Shield, Trash2, ArrowLeft } from "lucide-react";

import { leaveHouse, deleteHouse } from "@/lib/actions/house-actions";
import { useState } from "react";
import { deleteAccount } from "@/lib/actions/user-actions";

export default function HouseSettingsPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState<
    "leaveHouse" | "deleteHouse" | "deleteAccount" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => router.back();

  const handleLeaveHouse = () => {
    setError(null);
    setConfirmOpen("leaveHouse");
  };

  const handleDeleteHouse = () => {
    setError(null);
    setConfirmOpen("deleteHouse");
  };

  const handleDeleteAccount = () => {
    setError(null);
    setConfirmOpen("deleteAccount");
  };

  const confirmLeaveHouse = async () => {
    setIsProcessing(true);
    try {
      await leaveHouse();
      router.push("/setup-house");
    } catch (error) {
      setError(String(error));
    } finally {
      setIsProcessing(false);
      setConfirmOpen(null);
    }
  };

  const confirmDeleteHouse = async () => {
    setIsProcessing(true);
    try {
      await deleteHouse();
      router.push("/setup-house");
    } catch (error) {
      setError(String(error));
    } finally {
      setIsProcessing(false);
      setConfirmOpen(null);
    }
  };

  const confirmDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      await deleteAccount();
      router.push("/");
    } catch (error) {
      setError(String(error));
    } finally {
      setIsProcessing(false);
      setConfirmOpen(null);
    }
  };

  const isLeaveHouse = confirmOpen === "leaveHouse";
  const isDeleteHouse = confirmOpen === "deleteHouse";
  const isDeleteAccount = confirmOpen === "deleteAccount";

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          startContent={<ArrowLeft />}
          onPress={handleBack}
          className="mb-6 border border-white/10"
        >
          Back
        </Button>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        <Card className="rounded-3xl bg-white/5 border border-white/10 shadow-sm">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <House size={22} />
              <h1 className="text-2xl font-bold">House Settings</h1>
            </div>
            <p className="">
              Manage your house, members, and account settings.
            </p>
          </CardHeader>

          <Divider />

          <CardBody className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">House management</h2>
                  <p className="">
                    Actions that affect this house and its members.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 border border-red-500 text-white"
                  onPress={handleLeaveHouse}
                  startContent={<DoorOpen />}
                >
                  Leave House
                </Button>
                <Button
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 border border-red-500 text-white"
                  onPress={handleDeleteHouse}
                  startContent={<Trash2 />}
                >
                  Delete house
                </Button>
              </div>
            </section>

            <Divider />

            <section className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Account</h2>
                  <p className="">Actions that affect your user account.</p>
                </div>
              </div>

              <Button
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 border border-red-500 text-white"
                onPress={handleDeleteAccount}
                startContent={<Shield />}
              >
                Delete account
              </Button>
            </section>
          </CardBody>
        </Card>
      </div>
      <Modal
        isOpen={isLeaveHouse}
        onClose={() => setConfirmOpen(null)}
        title="Confirm leaving house"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="p-4 pb-4">
          <ModalHeader>
            <h3 className="text-lg font-bold">Are you sure?</h3>
          </ModalHeader>
          <ModalBody>
            <p className="">
              If you leave this house, all your house data and membership will
              be removed. This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onPress={() => setConfirmOpen(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onPress={confirmLeaveHouse}
              disabled={isProcessing}
            >
              {isProcessing ? "Leaving..." : "Leave house"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteHouse}
        onClose={() => setConfirmOpen(null)}
        title="Confirm delete house"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="p-4 pb-4">
          <ModalHeader>
            <h3 className="text-lg font-bold">Are you sure?</h3>
          </ModalHeader>
          <ModalBody>
            <p className="">
              Deleting this house will remove all its data and members. This
              action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onPress={() => setConfirmOpen(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onPress={confirmDeleteHouse}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete house"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteAccount}
        onClose={() => setConfirmOpen(null)}
        title="Confirm delete account"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="p-4 pb-4">
          <ModalHeader>
            <h3 className="text-lg font-bold">Are you sure?</h3>
          </ModalHeader>
          <ModalBody>
            <p className="">
              Deleting your account will remove all your data. This action
              cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onPress={() => setConfirmOpen(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onPress={confirmDeleteAccount}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete account"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
