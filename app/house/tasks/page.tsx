import { headers } from "next/dist/server/request/headers";
import { redirect } from "next/dist/client/components/navigation";
import { auth } from "@/lib/auth";
import Tasks from "./(task-components)/tasks";
import { getHouseById } from "@/lib/actions/house-actions";

export default async function BillsPage() {
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
          <h1 className="text-2xl font-semibold">House Tasks</h1>
          <p className="text-sm text-default-500">
            Track and manage shared tasks in your house. Here you can see all
            tasks organized by rooms.
          </p>
        </header>

        <Tasks house={house} />
      </div>
    </div>
  );
}
