"use client";

import { NavMain } from "@/components/doc/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ fileNodes }: { fileNodes: FileNode[] }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavMain fileNodes={fileNodes} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
