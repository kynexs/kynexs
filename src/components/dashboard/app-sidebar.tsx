"use client";

import {
  ClipboardList,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Mail,
  Swords,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { title: "Overview", href: "/overview", icon: LayoutDashboard },
  { title: "Registration", href: "/registration", icon: ClipboardList },
  { title: "Matches", href: "/total-matches", icon: Swords },
  { title: "Zones", href: "/gaming-zones", icon: Gamepad2 },
  { title: "Contacts", href: "/contacts", icon: Mail },
] as const;

export default function AppSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: "admin" | "user";
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    toast.success("Signed out");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/overview" />}
              tooltip="Kynexs"
            >
              <Image
                src="/images/kyneks-icon.webp"
                alt=""
                width={32}
                height={34}
                className="size-8 shrink-0 object-contain"
              />
              <span className="font-display text-base font-extrabold tracking-[0.04em] uppercase">
                Kynexs
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {userRole === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={
                      pathname === "/users" || pathname.startsWith("/users/")
                    }
                    tooltip="Users"
                    render={<Link href="/users" />}
                  >
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <button
            type="button"
            onClick={signOut}
            className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </button>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
