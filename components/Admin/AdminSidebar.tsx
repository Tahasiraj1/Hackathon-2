"use client";

import React from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { CgLogOut } from "react-icons/cg";

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Home, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: BarChart, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const sidebarOrderItems = [
  { label: "Pending Orders", href: "/admin/pending-orders" },
  { label: "Confirmed Orders", href: "/admin/confirmed-orders" },
  { label: "Dispatched Orders", href: "/admin/dispatched-orders" },
]

export default function AdminSidebar() {
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center p-4">
        {user?.imageUrl && (
          <Image
            src={user?.imageUrl}
            alt={user?.username || "User profile picture"}
            width={44}
            height={44}
            className="rounded-md mr-4"
          />
        )}
        <span>{user?.username}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel>
                <ShoppingCart className="mr-3 h-4 w-4" />
                Orders
              </SidebarGroupLabel>
              <SidebarGroupContent>
              {sidebarOrderItems.map((item) => (
                <SidebarMenu key={item.label}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
              ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 items-center justify-center bg-[#2A254B]">
        <Link href="/">
          <SignOutButton>
            <span className="flex text-white"><CgLogOut className="w-6 h-6 mr-2" /> LogOut</span>
          </SignOutButton>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
