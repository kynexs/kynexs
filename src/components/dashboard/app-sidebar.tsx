"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ClipboardList, LayoutDashboard, Swords } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { title: "Overview", href: "/overview", icon: LayoutDashboard },
  { title: "Registration", href: "/registration", icon: ClipboardList },
  { title: "Matches", href: "/total-matches", icon: Swords },
] as const;

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
          <span className="truncate text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
            {user?.fullName}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
