"use client";

import { Prisma } from "@/prisma/generated/browser";
import AlertCard from "../alerts/(alerts-components)/alert-card";
import MainButton from "@/app/_components/main-button";

type HouseAlerts = Prisma.HouseGetPayload<{
  include: {
    alerts: true;
  };
}>["alerts"];

export default function Alerts({ houseAlerts }: { houseAlerts: HouseAlerts }) {
  return (
    <div className="flex flex-col gap-6">
      {houseAlerts.filter((alert) => !alert.isResolved).length === 0 && (
        <p className="text-md text-default-500">No active alerts.</p>
      )}
      {houseAlerts.map(
        (alert) =>
          !alert.isResolved && <AlertCard key={alert.id} alert={alert} />,
      )}
      <MainButton href="/house/alerts">Go to All Alerts</MainButton>
    </div>
  );
}
