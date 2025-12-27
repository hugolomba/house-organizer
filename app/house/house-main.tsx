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
} from "@heroui/react";

import {
  ClipboardList,
  House as HouseIcon,
  ReceiptEuro,
  TriangleAlert,
} from "lucide-react";
import Alerts from "./(main-info-components)/alerts";
import { getHouseById } from "@/lib/actions/house-actions";
import Bills from "./(main-info-components)/bills";

type HouseProps = {
  house: NonNullable<Awaited<ReturnType<typeof getHouseById>>>;
};

export default function HouseMain({ house }: HouseProps) {
  const activeAlerts = house.alerts.filter((alert) => !alert.isResolved);

  return (
    <Card fullWidth shadow="md" className="rounded-t-none rounded-b-xl pb-2">
      <CardBody className="flex flex-col items-center justify-center">
        <HouseIcon />
        <h1 className="text-2xl font-bold">{house.name}</h1>
        <p className="text-center text-sm text-muted-foreground">
          {house.address}
        </p>
        <div className="users-group-div flex flex-col items-center gap-4">
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
              <Avatar size="sm" key={user.id} src={user.image || undefined} />
            ))}
          </AvatarGroup>
          <Button size="sm" variant="flat" color="success" radius="full">
            Invite
          </Button>
        </div>
      </CardBody>
      <CardFooter className="px-2">
        <Accordion
          variant="splitted"
          className="flex flex-col gap-2"
          disableIndicatorAnimation
        >
          <AccordionItem
            key="1"
            aria-label="Alerts"
            title={
              <p className="text-foreground/90 font-bold">
                Alerts {activeAlerts.length}
              </p>
            }
            indicator={<TriangleAlert color="#ff0000" />}
          >
            <Alerts houseAlerts={house.alerts} />
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Upcoming bills"
            title="Upcoming bills"
            indicator={<ReceiptEuro />}
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
      </CardFooter>
    </Card>
  );
}
