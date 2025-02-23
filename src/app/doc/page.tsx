"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import axios from "axios";

import { AppSidebar } from "@/components/doc/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Page() {

  const [ pageMarkdown, setPageMarkdown ] = useState("");
  const [ fileNodes, setFileNodes ] = useState<FileNode[]>();

  const searchParams = useSearchParams();
  const path = searchParams.get('path') ?? "";
  const splitPath = path.slice(1).split("/");

  useEffect(() => {
    axios.get(`/api/create-documentation?url=https://github.com/${searchParams.get('repo')}`).then((res) => {
      setFileNodes(res.data.summaries.individual.fileNodes);
    });
  }, [searchParams]);

  useEffect(() => {
    if (!fileNodes || !path) return;
    // Traverse the data object (no matter the depth) to find the markdown content according to the path
    const current: string | null = findContentByPath(fileNodes, path);
    if (current) {
      setPageMarkdown(current);
    }
  }, [fileNodes, path]);

  const findContentByPath: (fileNodes: FileNode[], targetPath: string) => string | null = (fileNodes, targetPath) => {

    console.log(`Searching fileNodes for path ${targetPath}...`);
    const queue: FileNode[] = [...fileNodes];
    console.log(`Initial queue length: ${queue.length}`);

    while (queue.length > 0) {
      
      const currentNode: FileNode | undefined = queue.shift();
      if (!currentNode) continue;

      console.log(`Checking ${currentNode.path}...`);
      
      if (typeof currentNode.content === "string" && currentNode.path === targetPath) {
        console.log("Found our node! Now returning its content...");
        return currentNode.content;
      }

      if (typeof currentNode.content === "string") {
        console.log("Current node is a string, skipping to next node...");
        continue;
      }

      console.log(`Found directory ${currentNode.path} with ${currentNode.content.length} item(s). Adding item(s) to queue.`);
      queue.push(...currentNode.content);
      console.log(`Remaining files in queue: ${queue.length}`);
    }

    console.log(`The target path ${targetPath} was not found.`);
    return null;

  }

  if (!fileNodes) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar fileNodes={fileNodes} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/doc?repo=${searchParams.get("repo")}`}>
                    {searchParams.get("repo") || "Home"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {splitPath.map((title) => (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      {title}
                    </BreadcrumbItem>
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">

          </div>
          <div className="min-h-[100vh] flex-1 md:min-h-min">
            {/* make this the markdown part */}
            <ReactMarkdown>
              {pageMarkdown}
            </ReactMarkdown>
            {/* <div className="" /> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}