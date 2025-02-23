"use client";

import { NavMain } from "@/components/doc/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ parsedRepo }: { parsedRepo: ParsedRepo }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavMain parsedRepo={parsedRepo} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
