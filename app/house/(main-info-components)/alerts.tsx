"use client";

import { Button, Link } from "@heroui/react";
import { Prisma } from "@/prisma/generated/browser";
import AlertCard from "../alerts/(alerts-components)/alert-card";

type HouseAlerts = Prisma.HouseGetPayload<{
  include: {
    alerts: true;
  };
}>["alerts"];

export default function Alerts({ houseAlerts }: { houseAlerts: HouseAlerts }) {
  return (
    <div className="flex flex-col gap-2">
      {houseAlerts.filter((alert) => !alert.isResolved).length === 0 && (
        <p className="text-md text-default-500">No active alerts.</p>
      )}
      {houseAlerts.map(
        (alert) =>
          !alert.isResolved && <AlertCard key={alert.id} alert={alert} />
      )}
      <Button as={Link} href="/house/alerts" variant="flat">
        Go to All Alerts
      </Button>
    </div>
  );
}
