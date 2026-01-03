import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getHouseById, getUserById } from "@/lib/actions/house-actions";
import HouseMain from "./house-main";

export default async function Home() {
  // get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // security check
  if (!session) {
    redirect("/auth");
  }

  // get user info
  const user = await getUserById(session!.user.id);
  const userHouseId = user?.houseId;
  const house = await getHouseById(userHouseId!);

  if (user?.houseId !== house?.id) {
    throw new Error("User does not belong to this house");
  }

  return (
    <div className="container flex flex-col items-center mx-auto">
      <HouseMain house={house} />
    </div>
  );
}
