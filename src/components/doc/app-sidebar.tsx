"use client"

import * as React from "react"

import { NavMain } from "@/components/doc/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"


export function AppSidebar(props: { data: any }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain content={props.data} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
