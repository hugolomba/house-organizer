"use client";

import { addToast, Alert, Button, closeToast, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  markAlertAsResolved,
  undoResolvedAlert,
} from "@/lib/actions/alerts-actions";
import { Undo2 } from "lucide-react";
import { Prisma } from "@/prisma/generated/browser";

type HouseAlerts = Prisma.HouseGetPayload<{
  include: {
    alerts: true;
  };
}>["alerts"];

export default function AlertCard({ alert }: { alert: HouseAlerts[number] }) {
  const router = useRouter();

  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<string>>(
    new Set()
  );

  const defineAlertColor = (alertId: string, priority: string) => {
    if (resolvedAlertIds.has(alertId)) return "success";

    switch (priority) {
      case "URGENT":
      case "HIGH":
        return "danger";
      case "MEDIUM":
      case "LOW":
        return "warning";
      default:
        return "primary";
    }
  };

  const defineAlertVariant = (alertPriority: string) => {
    switch (alertPriority) {
      case "URGENT":
        return "solid";

      case "MEDIUM":
      case "HIGH":
        return "faded";

      case "LOW":
        return "flat";

      default:
        return undefined;
    }
  };

  const handleResolveAlert = async (alertId: string, alertTitle: string) => {
    setResolvingAlertId(alertId);

    try {
      await markAlertAsResolved(alertId);

      setResolvedAlertIds((prev) => {
        const next = new Set(prev);
        next.add(alertId);
        return next;
      });
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    } finally {
      setResolvingAlertId(null);
      router.refresh();

      const key = addToast({
        title: "Alert resolved",
        description: `${alertTitle} has been marked as resolved.`,
        color: "success",
        shouldShowTimeoutProgress: true,
        endContent: (
          <Button
            onPress={() => {
              undoResolvedAlert(alertId);
              setResolvedAlertIds((prev) => {
                const next = new Set(prev);
                next.delete(alertId);
                return next;
              });
              router.refresh();
              closeToast(key!);
            }}
            variant="flat"
          >
            Undo <Undo2 />
          </Button>
        ),
      });
    }
  };

  return (
    <Alert
      description={alert.message}
      title={alert.title}
      key={alert.id}
      color={defineAlertColor(alert.id, alert.priority)}
      variant={defineAlertVariant(alert.priority)}
      classNames={{
        title: "break-words line-clamp-4 break-all overflow-hidden",
      }}
      endContent={
        resolvingAlertId === alert.id ? (
          <Button className="w-24" isLoading size="sm" variant="flat">
            Resolving...
          </Button>
        ) : (
          <Button
            size="sm"
            variant="flat"
            className="shrink-0 whitespace-nowrap min-w-80px"
            disabled={resolvedAlertIds.has(alert.id)}
            onPress={() => handleResolveAlert(alert.id, alert.title)}
          >
            {resolvedAlertIds.has(alert.id) ? "Resolved" : "Mark as resolved"}
          </Button>
        )
      }
    />
  );
}
