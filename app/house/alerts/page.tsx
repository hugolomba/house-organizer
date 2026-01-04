import { headers } from "next/dist/server/request/headers";
import { redirect } from "next/dist/client/components/navigation";
import { auth } from "@/lib/auth";
import { getHouseById } from "@/lib/actions/house-actions";
import Alerts from "./(alerts-components)/alerts";

export default async function AlertsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const house = await getHouseById(session.user.houseId!);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">House Alerts</h1>
          <p className="text-sm text-default-500">
            Track and manage alerts in your house
          </p>
        </header>

        <Alerts house={house} />
      </div>
    </div>
  );
}
