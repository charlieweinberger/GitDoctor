"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter, ReadonlyURLSearchParams } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import { ChevronRight, File, Folder } from "lucide-react";

function CollapsibleItem({ fileNode, activeFile, setActiveFile }: {
  fileNode: FileNode
  activeFile: string
  setActiveFile: (filePath: string) => void
}) {

  const pathname: string = usePathname();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const router = useRouter();

  const title: string = fileNode.path.split('/').pop() ?? "";

  const handleClick = () => {
    setActiveFile(fileNode.path);
    const repo: string = searchParams.get("repo") ?? "";
    router.push(`${pathname}?repo=${repo}&path=${fileNode.path}`);
  }

  if (typeof fileNode.content === "string") {
    return (
      <Collapsible
        key={fileNode.path}
        asChild
        defaultOpen={fileNode.path === activeFile}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleClick()} tooltip={fileNode.path} className="flex flex-row gap-2">
            <File className="size-4" />
            <p>{title}</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <Collapsible
      key={fileNode.path}
      asChild
      defaultOpen={fileNode.path === activeFile}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={fileNode.path} className="flex flex-row gap-2">
            <Folder/>
            <p>{title}</p>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {
              fileNode.content.map((childFileNode: FileNode) => (
                <CollapsibleItem key={childFileNode.path} fileNode={childFileNode} activeFile={activeFile} setActiveFile={setActiveFile} />
              ))
            }
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ fileNodes }: { fileNodes: FileNode[] }) {
  
  const [ activeFile, setActiveFile ] = useState(fileNodes[0].path);

  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const repo: string | null = searchParams.get("repo");

  return (
    <SidebarGroup>
      <div className="mt-3 mx-3 mb-5">
        <p className="text-xs">Docs for</p>
        <h1 className="text-lg font-medium">{repo}</h1>
      </div>
      <SidebarMenu>
        {
          fileNodes.map((fileNode: FileNode) => (
            <CollapsibleItem key={fileNode.path} fileNode={fileNode} activeFile={activeFile} setActiveFile={setActiveFile} />
          ))
        }
      </SidebarMenu>
    </SidebarGroup>
  );
}
