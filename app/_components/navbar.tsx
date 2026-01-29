"use client";
import { useState } from "react";

import { auth } from "@/lib/auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Divider,
} from "@heroui/react";

import { signOut } from "@/lib/actions/auth-actions";
import { ThemeSwitcher } from "./theme-switcher";
import MainButton from "./main-button";
import Image from "next/image";

type Session = typeof auth.$Infer.Session;

export default function App({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isBordered
      isBlurred
      shouldHideOnScroll
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{ base: "bg-foreground rounded-b-2xl " }}
    >
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Image
            src="/images/logo2.png"
            alt="HouseMates Logo"
            width={40}
            height={40}
            className="hover:scale-105 transition"
          />

          <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            HouseMates
          </span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/house/alerts">
            Alerts
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/house/bills">
            Bills
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/house/tasks">
            Tasks
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/house/rooms">
            Rooms
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex text-foreground">
          {session && <NavbarWithSession session={session} />}
        </NavbarItem>

        {session ? (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        ) : (
          <NavbarItem>
            <div className="flex items-center gap-3">
              <MainButton href="/auth">Sign Up / Login</MainButton>
            </div>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="flex flex-col items-center bg-white dark:bg-gray-900 pt-4">
        <NavbarMenuItem>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            name={session?.user?.name || "User"}
            size="lg"
            src={session?.user?.image || ""}
          />
        </NavbarMenuItem>
        <Divider />
        <NavbarMenuItem key="alerts" className="mt-4">
          <Link className="" href="/house/alerts" color="primary" size="lg">
            Alerts
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="bills">
          <Link className="" href="/house/bills" color="primary" size="lg">
            Bills
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="tasks">
          <Link href="/house/tasks" color="primary" size="lg">
            Tasks
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="rooms">
          <Link href="/house/rooms" color="primary" size="lg">
            Rooms
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem key="logout">
          <Divider />
          <Link
            as="button"
            href="/house/rooms"
            color="danger"
            size="lg"
            onPress={() => {
              setIsMenuOpen(false);
              signOut();
            }}
          >
            Logout
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

export function NavbarWithSession({ session }: { session: Session }) {
  return (
    <NavbarContent as="div" className="items-center" justify="end">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            name={session.user?.name || "User"}
            size="md"
            src={session.user?.image || ""}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="signed-in-as" className="h-14 gap-2">
            <p className="font-semibold">
              Signed in as {session.user?.name || ""}
            </p>
          </DropdownItem>

          <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
}
