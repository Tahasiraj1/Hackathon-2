"use client";

import type React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <SidebarTrigger />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
