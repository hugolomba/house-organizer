"use client";
import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  Alert,
} from "@heroui/react";

import {
  ClipboardList,
  Clock,
  Euro,
  House as HouseIcon,
  Lock,
  ReceiptEuro,
  SquarePlus,
  TriangleAlert,
  Check,
  Copy,
  Settings,
} from "lucide-react";
import Alerts from "./(main-info-components)/alerts";
import { getHouseById } from "@/lib/actions/house-actions";
import Bills from "./(main-info-components)/bills";
import { useState } from "react";
import Credentials from "./(main-info-components)/credentials";
import Tasks from "./(main-info-components)/tasks";
import CreateAlert from "./alerts/(alerts-components)/create-alert";
import CreateBill from "../house/bills/(bill-components)/create-bill";
import CreateTask from "./tasks/(task-components)/create-task";
import AddCredential from "./(main-info-components)/add-credential";
import Rooms from "./(main-info-components)/rooms";
import Image from "next/image";
import { div } from "framer-motion/m";

type HouseProps = {
  house: NonNullable<Awaited<ReturnType<typeof getHouseById>>>;
};

export default function HouseMain({ house }: HouseProps) {
  type ModalType =
    | null
    | "users"
    | "invite"
    | "credentials"
    | "createAlert"
    | "createBill"
    | "createTask"
    | "addCredential";

  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [copied, setCopied] = useState(false);

  const upcomingBills = house.bills.filter((bill) => {
    const dueDate = new Date(bill.dueDate);
    const now = new Date();

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return (
      dueDate >= now &&
      dueDate <= sevenDaysFromNow &&
      !bill.shares.every((share) => share.paid)
    );
  });
  const activeAlerts = house.alerts.filter((alert) => !alert.isResolved);
  const activeTasks = house.tasks.filter((task) => !task.status);

  function timeAgoShort(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (date > yesterday) {
      if (seconds < 60) return `${seconds}s ago`;
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `yesterday`;
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(house.inviteCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="container flex flex-col gap-4 p-2">
      <Card
        fullWidth
        className="
    rounded-4xl
    bg-gradient-to-br from-blue-500 to-blue-600
    dark:from-gray-700 dark:to-gray-800
    text-white
   
    shadow-
    ring-1 ring-white/10
  "
      >
        <CardHeader className="flex flex-row items-center justify-center p-0 mt-4">
          <HouseIcon size={52} className="opacity-90" />{" "}
        </CardHeader>
        <CardBody className="flex flex-col items-center justify-center p-4">
          {/* <HouseIcon size={48} /> */}
          <h1 className="text-3xl font-bold mt-2">{house.name}</h1>
          <p className="text-center text-md text-muted-foreground">
            {house.address}
          </p>
          <div className="users-group-div flex flex-col items-center gap-4">
            <AvatarGroup
              onClick={() => setOpenModal("users")}
              max={3}
              total={house.users.length}
              renderCount={(count) => (
                <p className="text-small text-foreground font-medium ms-2">
                  +{count - 3} other{count - 3 === 1 ? "" : "s"}
                </p>
              )}
              isBordered
              className="mt-4"
            >
              {house.users.map((user) => (
                <Avatar size="sm" key={user.id} src={user.image || undefined} />
              ))}
            </AvatarGroup>
          </div>
        </CardBody>

        <CardFooter className="flex gap-4 justify-center py-4">
          <Button
            size="md"
            className="rounded-full bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
            onPress={() => setOpenModal("invite")}
          >
            Invite
          </Button>
          <Button
            startContent={<Lock size={15} />}
            size="md"
            className="rounded-full bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
            onPress={() => setOpenModal("credentials")}
          >
            Credentials
          </Button>
          <Button
            size="md"
            // variant="ghost"
            startContent={<Settings size={15} />}
            className="rounded-full bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
          >
            Settings
          </Button>
        </CardFooter>
      </Card>

      {/* quick actions */}

      <section className="p-2">
        <h2 className="mb-2 text-lg font-semibold text-foreground/70">
          Quick actions
        </h2>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onPress={() => setOpenModal("createAlert")}
            color="primary"
            className="rounded-full bg-blue-600 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
          >
            New Alert
          </Button>

          <Button
            onPress={() => setOpenModal("createBill")}
            color="primary"
            className="rounded-full bg-blue-600 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
          >
            New Bill
          </Button>
          <Button
            onPress={() => setOpenModal("createTask")}
            color="primary"
            className="rounded-full bg-blue-600 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70"
          >
            New Task
          </Button>
        </div>
      </section>

      {/* house overview */}
      <section className="p-2">
        <h2 className="mb-2 text-lg font-semibold text-foreground/70">
          House Overview
        </h2>
        <Accordion
          fullWidth
          disableIndicatorAnimation
          variant="splitted"
          className="p-0"
        >
          <AccordionItem
            key="1"
            aria-label="Alerts"
            title={<p className="text-foreground/90 font-bold">Alerts</p>}
            indicator={
              <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">
                  ({activeAlerts.length})
                </span>{" "}
                <TriangleAlert color="#ff0000" />
              </div>
            }
          >
            <Alerts houseAlerts={house.alerts} />
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Upcoming bills"
            title={
              <p className="text-foreground/90 font-bold">Upcoming Bills</p>
            }
            indicator={
              <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">
                  ({upcomingBills.length})
                </span>{" "}
                <ReceiptEuro color="green" />
              </div>
            }
          >
            <Bills houseBills={house.bills} />
          </AccordionItem>

          <AccordionItem
            key="3"
            aria-label="Upcoming Tasks"
            title={
              <p className="text-foreground/90 font-bold">Upcoming Tasks</p>
            }
            indicator={
              <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">
                  ({activeTasks.length})
                </span>{" "}
                <ClipboardList color="#008ee6" />
              </div>
            }
          >
            {<Tasks houseTasks={house.tasks} />}
          </AccordionItem>
        </Accordion>
      </section>

      {/* house rooms */}
      <section className="p-2">
        <h2 className="mb-2 text-lg font-semibold text-foreground/70">
          House Rooms
        </h2>
        <Rooms houseRooms={house.rooms} />
      </section>

      {/* recent activity */}
      <Accordion fullWidth isCompact defaultExpandedKeys={["1"]}>
        <AccordionItem
          key={"1"}
          title={
            <h2 className="mb-2 text-lg font-semibold text-foreground/70">
              Recent activity
            </h2>
          }
          startContent={<Clock />}
        >
          {house.activities.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No recent activity
            </p>
          ) : (
            <Accordion
              fullWidth
              disableIndicatorAnimation
              isCompact
              variant="light"
              itemClasses={{
                titleWrapper: "flex flex-row justify-between",
              }}
            >
              {house.activities.map((activity) => (
                <AccordionItem
                  key={activity.id}
                  aria-label={activity.message}
                  title={activity.title}
                  subtitle={timeAgoShort(new Date(activity.createdAt))}
                  hideIndicator
                >
                  <p className="text-foreground/90">{activity.message}</p>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </AccordionItem>
      </Accordion>

      <CreateAlert
        createAlertIsOpen={openModal === "createAlert"}
        setCreateAlertIsOpen={(value) =>
          setOpenModal(value ? "createAlert" : null)
        }
      />

      <CreateBill
        createBillIsOpen={openModal === "createBill"}
        setCreateBillIsOpen={(value) =>
          setOpenModal(value ? "createBill" : null)
        }
        houseUsers={house.users}
        houseId={house.id}
      />

      <CreateTask
        createTaskIsOpen={openModal === "createTask"}
        setCreateTaskIsOpen={(value) =>
          setOpenModal(value ? "createTask" : null)
        }
        users={house.users}
        rooms={house.rooms}
        houseId={house.id}
      />
      <Modal
        isOpen={openModal === "credentials"}
        onClose={() => setOpenModal(null)}
        title="House Credentials"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="p- pb-4">
          <ModalHeader className="flex- flex-col">
            <div className="flex flex-row justify-center">
              <Lock /> <span className="ml-2">House Credentials</span>
            </div>
            <Alert
              description="Passwords are securely encrypted. Only authorized house members can access them."
              variant="flat"
              className="mt-2"
              color="warning"
              hideIcon
            />
          </ModalHeader>

          {openModal !== "addCredential" ? (
            <ModalBody>
              <Button
                size="sm"
                variant="flat"
                className="mb-2 mx-4"
                onPress={() => setOpenModal("addCredential")}
              >
                + Add Credential
              </Button>
              <Credentials houseCredentials={house.credentials} />
            </ModalBody>
          ) : (
            <AddCredential
              setAddCredentialIsOpen={(value) =>
                setOpenModal(value ? "addCredential" : "credentials")
              }
              houseId={house.id}
            />
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={openModal === "users"}
        onClose={() => setOpenModal(null)}
        title="House Users"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="p- pb-4">
          <ModalHeader>
            <h2 className="flex flex-row items-center gap-2">
              {house.users.length} people in {house.name}
            </h2>
          </ModalHeader>
          <div className="flex flex-col gap-2 p-4  overflow-y-auto">
            {house.users.map((user) => (
              <div key={user.id} className="flex flex-row items-center gap-4">
                <Avatar size="md" src={user.image || undefined} />
                <div className="flex flex-col">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </ModalContent>
      </Modal>

      {/* // Invite Modal */}
      <Modal
        isOpen={openModal === "invite"}
        onClose={() => setOpenModal(null)}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="">Invite people to your house</ModalHeader>
          <div className="mb-4 px-4 flex flex-col gap-4">
            <p className="text-sm">
              Share this link with people you want to invite. Anyone with this
              link will be able to join this house.
            </p>

            <Input
              label="Invite link"
              value={house.inviteCode}
              readOnly
              endContent={
                <Button isIconOnly variant="light" onPress={handleCopy}>
                  {copied ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              }
            />

            {copied && (
              <p className="text-sm text-success">Link copied to clipboard</p>
            )}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
