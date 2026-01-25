"use client";

import {
  getHouseByInviteCode,
  joinHouseByInviteCode,
} from "@/lib/actions/house-actions";
import { Prisma } from "@/prisma/generated/client";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  Form,
  Input,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SetupHouse() {
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState("");
  const [codeIsValid, setCodeIsValid] = useState<boolean | null>(null);
  const [houseToJoin, setHouseToJoin] = useState<Prisma.HouseGetPayload<{
    include: { users: true };
  }> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const validateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setErrorMessage(null);

    try {
      const house = await getHouseByInviteCode(inviteCode);
      setHouseToJoin(house);
      setCodeIsValid(house !== null);
    } catch (err) {
      setErrorMessage("Invalid invite code");
      setCodeIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const joinHouse = async () => {
    setIsJoining(true);
    setErrorMessage(null);

    try {
      await joinHouseByInviteCode(inviteCode);
      setHasJoined(true);

      setTimeout(() => {
        router.push("/house");
      }, 3000);
    } catch (err) {
      setErrorMessage("Failed to join house" + err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md p-8">
      {errorMessage && (
        <Alert
          variant="flat"
          color="danger"
          title="Error"
          description={errorMessage}
        />
      )}
      <h1 className="text-2xl font-bold">Join in an existing house</h1>
      {!houseToJoin && (
        <h2 className="text-center">
          To join in an existing house, please ask the house admin for the
          invite code.
        </h2>
      )}

      <div className="w-full min-h-75 flex items-center justify-center">
        {isValidating && (
          <Spinner
            size="lg"
            variant="wave"
            label="Validating Invitation Code"
          />
        )}

        {!codeIsValid && !isValidating && (
          <Form
            className="w-full flex flex-col items-center"
            onSubmit={validateCode}
          >
            <Input
              label="House Invite Code"
              placeholder="Enter the house invite code"
              labelPlacement="outside"
              required
              size="lg"
              onValueChange={setInviteCode}
            />
            <Button
              type="submit"
              size="lg"
              variant="solid"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-white font-semibold mt-4"
            >
              Validate Invite Code{" "}
            </Button>
          </Form>
        )}

        {!isValidating && codeIsValid && (
          <Card className="w-full p-4">
            <CardBody className="flex items-center">
              <p className="text-2xl font-bold mb-2">{houseToJoin?.name}</p>
              <p className="mb-4"> {houseToJoin?.address || "N/A"}</p>
              <p className="mb-4">Members: </p>
              <AvatarGroup isBordered>
                {houseToJoin?.users.map(
                  (
                    user: Prisma.UserGetPayload<{
                      include: { house: true } | null;
                    }>,
                  ) => (
                    <Avatar
                      src={user.image || ""}
                      name={user.name || "User"}
                      key={user.id}
                    />
                  ),
                )}
              </AvatarGroup>
            </CardBody>
            <CardFooter className="flex flex-col items-center">
              {isJoining && !hasJoined && (
                <Button
                  isLoading
                  type="button"
                  className=""
                  size="lg"
                  variant="solid"
                >
                  Joining House
                </Button>
              )}

              {!isJoining && !hasJoined && (
                <Button onPress={joinHouse}>Join House</Button>
              )}
              {hasJoined && (
                <>
                  <Alert
                    variant="flat"
                    color="success"
                    title="You have joined the house!"
                    description="redirecting to your house..."
                  />
                  <Link href="/" className="mt-2 text-xs underline">
                    click here if not redirected
                  </Link>
                </>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
