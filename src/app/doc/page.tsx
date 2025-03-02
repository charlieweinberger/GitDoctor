"use client";

import { useState, useEffect } from "react";
import { useSearchParams, ReadonlyURLSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

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

import { AppSidebar } from "@/components/doc/app-sidebar";
import { fetchGET } from '@/lib/utils';

export default function Page() {

  const [ pageMarkdown, setPageMarkdown ] = useState("");
  const [ parsedRepo, setParsedRepo ] = useState<ParsedRepo>();
  const [ overall, setOverall ] = useState("");

  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const path: string = searchParams.get('path') ?? "";
  const splitPath: string[] = path.slice(1).split("/");

  useEffect(() => {
    const setSummaries = async() => {
      const response: Summaries | null = await fetchGET(`api/py/gitingest?url=${searchParams.get('url')}`);
      if (!response) {
        throw new Error("Error while fetching.");
      }
      console.log("\n\n\nresponse:");
      console.log(response);
      console.log("\n\n");
      setParsedRepo(response.parsedRepo);
      setOverall(response.overall);
    }
    setSummaries();
  }, [searchParams]);

  useEffect(() => {

    // Traverse the data object (no matter the depth) to find the markdown content according to the path
    
    if (!parsedRepo || !path) {
      setPageMarkdown(overall);
      return;
    }

    console.log(`Searching parsedRepo for path ${path}...`);
    const queue: ParsedRepo = [...parsedRepo];
    console.log(`Initial queue length: ${queue.length}`);

    while (queue.length > 0) {
      
      const node: ParsedRepoNode | undefined = queue.shift();
      if (!node) continue;

      console.log(`Checking ${node.path}...`);
      
      if (typeof node.content === "string" && node.path === path) {
        console.log("Found our node! Now returning its content...");
        setPageMarkdown(node.content);
        return;
      }

      if (typeof node.content === "string") {
        console.log("Current node is a string, skipping to next node...");
        continue;
      }

      console.log(`Found directory ${node.path} with ${node.content.length} item(s). Adding item(s) to queue.`);
      queue.push(...node.content);
      console.log(`Remaining files in queue: ${queue.length}`);

    }

    console.log(`The target path ${path} was not found.`);
    setPageMarkdown("");

  }, [parsedRepo, overall, path]);

  if (!parsedRepo) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar parsedRepo={parsedRepo} />
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
                  <div className="flex flex-row items-center" key={title}>
                  <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {title}
                    </BreadcrumbItem>
                  </div>
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