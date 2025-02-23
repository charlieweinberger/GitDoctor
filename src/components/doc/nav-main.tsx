"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import {
  File,
  Folder
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"


export function NavMain({
  content
}: {
  content: {
    path: string
    isActive?: boolean
    type: "tree" | "blob"
    content?: {
      path: string
      url: string
      content: string
    }[]
  }[]
}) {

  const searchParams = useSearchParams();
  const repo = searchParams.get('repo')

  return (
    <SidebarGroup>
      <div className="mt-3 mx-3 mb-5">
        <p className="text-xs">Docs for</p>
        <h1 className="text-lg font-medium">{repo}</h1>
      </div>
      <SidebarMenu>
        {content.map((item) => (
          <CollapsibleItem key={item.path} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}


function CollapsibleItem({ item }: any) {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = item.path.split('/').pop()


  function handleClick() {
    let repo = searchParams.get('repo')
    router.push(`${pathname}?repo=${repo}&path=${item.path}`)
  }


  if (item.type === "blob") {
    return (
      <Collapsible
        key={item.path}
        asChild
        defaultOpen={item.isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleClick()} tooltip={item.path}>
            <File className="mr-2 size-4" />
            <span className="ms-2">{title}</span>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem: any) => (
                <CollapsibleItem key={subItem.path} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <Collapsible
      key={item.path}
      asChild
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.path}>
            <Folder className="mr-2" />
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.content?.map((subItem: any) => (
              <CollapsibleItem key={subItem.path} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}