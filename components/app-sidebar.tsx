"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Languages, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

// Sidebar menu items
const menu = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Videos", path: "/videos", icon: FileText },
  { title: "Languages", path: "/languages", icon: Languages },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(!open);

  useEffect(() => {
    setIsCollapsed(!open);
  }, [open]);

  const isMenuActive = (path: string) => pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Sidebar
      {...props}
      collapsible="none"
      className={`h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[70px]" : "w-[240px]"
      } overflow-hidden`}
    >
      {/* Sidebar Header */}
      <SidebarHeader className="transition-opacity duration-300 ease-in-out">
        <div className={`text-2xl text-center font-bold my-10`}>
          {!isCollapsed && <span>ENEC 360</span>}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Sidebar Content */}
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarMenu>
            {menu.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.path}>
                  <SidebarMenuButton
                    className="space-x-3"
                    isActive={isMenuActive(item.path)}
                  >
                    <item.icon className="transition-transform duration-300" />
                    <span
                      className={`transition-opacity duration-300 ease-in-out ${
                        isCollapsed ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                onClick={handleLogout}
                className="w-full flex space-x-3 cursor-pointer hover:bg-secondary p-2 flex-wrap items-center gap-3 transition-all duration-300 ease-in-out"
              >
                <LogOut size={18} className="text-red-500" />
                <span
                  className={`transition-opacity duration-300 ${
                    isCollapsed ? "hidden" : "inline"
                  }`}
                >
                  Logout
                </span>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
