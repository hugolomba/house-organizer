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
  user,
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
} from "lucide-react";
import Alerts from "./(main-info-components)/alerts";
import { getHouseById } from "@/lib/actions/house-actions";
import Bills from "./(main-info-components)/bills";
import { useState } from "react";
import Credentials from "./(main-info-components)/credentials";

type HouseProps = {
  house: NonNullable<Awaited<ReturnType<typeof getHouseById>>>;
};

export default function HouseMain({ house }: HouseProps) {
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  console.log(" users modal open:", usersOpen);

  const activeAlerts = house.alerts.filter((alert) => !alert.isResolved);

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

  return (
    <div className="container p-2 flex flex-col gap-2">
      <Card fullWidth shadow="md" className="py-2">
        <CardBody className="flex flex-col items-center justify-center">
          <HouseIcon />
          <h1 className="text-2xl font-bold">{house.name}</h1>
          <p className="text-center text-sm text-muted-foreground">
            {house.address}
          </p>
          <div className="users-group-div flex flex-col items-center gap-4">
            <Card shadow="none" onPress={() => setUsersOpen(true)} isPressable>
              <CardBody>
                <AvatarGroup
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
                    <Avatar
                      size="sm"
                      key={user.id}
                      src={user.image || undefined}
                    />
                  ))}
                </AvatarGroup>
              </CardBody>
            </Card>
          </div>
        </CardBody>
        <CardFooter className="px-2 flex gap-4 justify-center">
          <Button size="sm" variant="flat">
            Invite
          </Button>
          <Button
            startContent={<Lock size={15} />}
            size="sm"
            variant="flat"
            onPress={() => {
              setCredentialsOpen(true);
            }}
          >
            Passwords
          </Button>
          <Button size="sm" variant="flat">
            More Info
          </Button>
        </CardFooter>
      </Card>

      <Card fullWidth shadow="md">
        <CardBody>
          <Accordion
            // variant="splitted"
            // className="flex flex-col gap-2 px-0"
            fullWidth
            disableIndicatorAnimation
          >
            <AccordionItem
              key="1"
              aria-label="Alerts"
              title={
                <p className="text-foreground/90 font-bold">
                  Alerts ({activeAlerts.length})
                </p>
              }
              indicator={<TriangleAlert color="#ff0000" />}
            >
              <Alerts houseAlerts={house.alerts} />
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Upcoming bills"
              title={
                <p className="text-foreground/90 font-bold">
                  Upcoming Bills ({house.bills.length})
                </p>
              }
              indicator={<ReceiptEuro color="green" />}
            >
              <Bills houseBills={house.bills} />
            </AccordionItem>

            <AccordionItem
              key="3"
              aria-label="Upcoming Tasks"
              title="Upcoming Tasks"
              indicator={<ClipboardList />}
            ></AccordionItem>
          </Accordion>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <SquarePlus /> <h2 className="font-bold">Quick Actions</h2>
        </CardHeader>
        <Divider orientation="horizontal" />
        <CardBody className="flex flex-row gap-2">
          <Button
            variant="flat"
            color="danger"
            startContent={<TriangleAlert />}
          >
            Create Alert
          </Button>
          <Button variant="flat" color="primary" startContent={<Euro />}>
            Add Bill
          </Button>

          <Button
            variant="flat"
            color="success"
            startContent={<ClipboardList />}
          >
            New Task
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Accordion fullWidth disableIndicatorAnimation isCompact>
            <AccordionItem
              title={<h2 className="font-bold">Recent activity</h2>}
              indicator={<Clock />}
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
        </CardBody>
      </Card>

      <Modal
        isOpen={credentialsOpen}
        onClose={() => setCredentialsOpen(false)}
        title="House Credentials"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="p- pb-4">
          <ModalHeader>
            <Lock /> <span className="ml-2">House Credentials</span>
          </ModalHeader>
          <Credentials houseCredentials={house.credentials} />
        </ModalContent>
      </Modal>

      <Modal
        isOpen={usersOpen}
        onClose={() => setUsersOpen(false)}
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
    </div>
  );
}
