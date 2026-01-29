import {
  HouseIcon,
  TriangleAlert,
  ReceiptEuro,
  ClipboardList,
  BedSingle,
  Settings,
} from "lucide-react";

export default async function HouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto  h-full lg:p-8 ">
      {/* SIDEBAR */}
      <aside
        className="hidden lg:block col-span-1 h-full rounded-2xl shadow-xl
                        bg-linear-to-b dark:from-gray-700 dark:to-gray-800 "
      >
        <div className="flex flex-col h-full p-4">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <HouseIcon size={36} /> Dashboard
          </h2>

          <nav className="flex flex-col gap-6 text-sm pl-6">
            <a
              href="/house/alerts"
              className="nav-item flex flex-row items-center gap-2 text-2xl"
            >
              <TriangleAlert size={30} /> Alerts
            </a>

            <a
              href="/house/bills"
              className="nav-item flex flex-row items-center gap-2 text-2xl"
            >
              <ReceiptEuro size={30} /> Bills
            </a>

            <a
              href="/house/tasks"
              className="nav-item flex flex-row items-center gap-2 text-2xl"
            >
              <ClipboardList size={30} /> Tasks
            </a>

            <a
              href="/house/rooms"
              className="nav-item flex flex-row items-center gap-2 text-2xl"
            >
              <BedSingle size={30} /> Rooms
            </a>

            <a
              href="/house/settings"
              className="nav-item flex flex-row items-center gap-2 text-2xl"
            >
              <Settings size={30} /> Settings
            </a>
          </nav>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="w-full h-full col-span-3">{children}</div>
    </div>
  );
}
