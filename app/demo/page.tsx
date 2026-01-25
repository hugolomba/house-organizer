import HouseMain from "@/app/house/house-main";
import { signIn } from "@/lib/actions/auth-actions";
import { getDemoHouse, getHouseById } from "@/lib/actions/house-actions";
import { auth } from "@/lib/auth";
import { DemoProvider, useDemo } from "@/lib/demo-context";
import { redirect } from "next/dist/client/components/navigation";
import { headers } from "next/dist/server/request/headers";

export default async function DemoPage() {
  //   const { addBill, addTask, addAlert, addCredential } = useDemo();

  // login as demo user
  await signIn("user@demo.com", "demopassword");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Fetching demo house data...", session);

  const house = await getDemoHouse(); // demo house

  return (
    <HouseMain
      house={house}
      //   actions={{ addBill, addTask, addAlert, addCredential }}
    />
  );
}
