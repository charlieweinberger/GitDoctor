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

function CollapsibleItem({ node, activeFile, setActiveFile }: {
  node: ParsedRepoNode
  activeFile: string
  setActiveFile: (filePath: string) => void
}) {

  const pathname: string = usePathname();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const router = useRouter();

  const title: string = node.path.split('/').pop() ?? "";

  const handleClick = () => {
    setActiveFile(node.path);
    const repo: string = searchParams.get("repo") ?? "";
    router.push(`${pathname}?repo=${repo}&path=${node.path}`);
  }

  if (typeof node.content === "string") {
    return (
      <Collapsible
        key={node.path}
        asChild
        defaultOpen={node.path === activeFile}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => handleClick()} tooltip={node.path} className="flex flex-row gap-2">
            <File className="size-4" />
            <p>{title}</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <Collapsible
      key={node.path}
      asChild
      defaultOpen={node.path === activeFile}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={node.path} className="flex flex-row gap-2">
            <Folder/>
            <p>{title}</p>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {node.content.map((node: ParsedRepoNode) => (
              <CollapsibleItem key={node.path} node={node} activeFile={activeFile} setActiveFile={setActiveFile} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ parsedRepo }: { parsedRepo: ParsedRepo }) {
  
  const [ activeFile, setActiveFile ] = useState(parsedRepo[0].path);

  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const repo: string | null = searchParams.get("repo");

  return (
    <SidebarGroup>
      <div className="mt-3 mx-3 mb-5">
        <p className="text-xs">Docs for</p>
        <h1 className="text-lg font-medium">{repo}</h1>
      </div>
      <SidebarMenu>
        {parsedRepo.map((node: ParsedRepoNode) => (
          <CollapsibleItem key={node.path} node={node} activeFile={activeFile} setActiveFile={setActiveFile} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
