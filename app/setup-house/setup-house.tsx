"use client";

import { Button } from "@heroui/react";
import { ArrowBigLeft, CirclePlus, HousePlus } from "lucide-react";
import { useState } from "react";
import CreateHouseForm from "./create-house-form";
import JoinHouse from "./join-house";

export default function SetupHouse() {
  const [mode, setMode] = useState<"create" | "join" | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative w-full">
      {mode && (
        <Button
          className="absolute top-4 left-4"
          // variant="ghost"
          href="/"
          startContent={<ArrowBigLeft />}
          onPress={() => setMode(null)}
        >
          Back
        </Button>
      )}
      {!mode && (
        <>
          <h1 className="text-center text-2xl font-bold">
            You still don&apos;t have a house
          </h1>
          <h2 className="text-center text-lg">
            Create or Join in a existing one
          </h2>
          <div className="flex flex-col gap-4 mt-6">
            <Button
              onPress={() => setMode("create")}
              size="lg"
              startContent={<HousePlus />}
            >
              Create House
            </Button>
            <Button
              onPress={() => setMode("join")}
              size="lg"
              startContent={<CirclePlus />}
              className=""
            >
              Join An House
            </Button>
          </div>
        </>
      )}
      {mode === "create" && <CreateHouseForm />}
      {mode === "join" && <JoinHouse />}
    </div>
  );
}
