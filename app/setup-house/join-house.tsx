"use client";

import {
  getHouseByInviteCode,
  joinHouseByInviteCode,
} from "@/lib/actions/house-actions";
import { House } from "@/prisma/generated/browser";
import { Prisma } from "@/prisma/generated/client";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Input,
} from "@heroui/react";
import { useState } from "react";

export default function SetupHouse() {
  const [inviteCode, setInviteCode] = useState("");
  const [codeIsValid, setCodeIsValid] = useState<boolean | null>(null);
  const [houseToJoin, setHouseToJoin] = useState<Prisma.HouseGetPayload<{
    include: { users: true };
  }> | null>(null);

  const validateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const house = await getHouseByInviteCode(inviteCode);
    setHouseToJoin(house);
    setCodeIsValid(house !== null);
    console.log("House to join:", house);
  };

  const joinHouse = async () => {
    // implement join house logic here
    await joinHouseByInviteCode(inviteCode);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md p-8">
      <h1 className="text-2xl font-bold">Join in an existing house</h1>
      <h2 className="text-center">
        To join in an existing house, please ask the house admin for the invite
        code.
      </h2>

      {!codeIsValid ? (
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
          <Button type="submit" className="mt-4" size="lg" variant="solid">
            Validate Invite Code{" "}
          </Button>
        </Form>
      ) : (
        // <C className="w-full flex flex-col items-center">
        //   <h3 className="text-xl font-semibold mb-4">House Found!</h3>
        //   <p className="mb-2">House Name: {houseToJoin.name}</p>
        //   <p className="mb-4">Address: {houseToJoin.address || "N/A"}</p>
        //   <Button size="lg" variant="solid">
        //     Join House
        //   </Button>
        // </div>
        <Card className="w-full p-4">
          {/* <CardHeader>
            {houseToJoin.name} - Invite Code: {houseToJoin.inviteCode}
          </CardHeader> */}
          <CardBody className="flex items-center">
            <p className="text-2xl font-bold mb-2">{houseToJoin?.name}</p>
            <p className="mb-4"> {houseToJoin?.address || "N/A"}</p>
            <p className="mb-4">Members: </p>
            <AvatarGroup isBordered>
              {houseToJoin?.users.map(
                (
                  user: Prisma.UserGetPayload<{
                    include: { house: true } | null;
                  }>
                ) => (
                  <Avatar
                    src={user.image || ""}
                    name={user.name || "User"}
                    key={user.id}
                  />
                )
              )}
            </AvatarGroup>
          </CardBody>
          <CardFooter className="flex flex-col items-center">
            <Button onPress={joinHouse}>Join House</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
