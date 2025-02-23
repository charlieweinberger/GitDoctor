"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import axios from 'axios'

import { AppSidebar } from "@/components/doc/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  const searchParams = useSearchParams()
  const path = searchParams.get('path') ?? ""
  const splitPath = path.slice(1).split("/")

  const [pageMarkdown, setPageMarkdown] = useState("")

  const [data, setData] = useState([])

  useEffect(() => {
    let githubUrl = "https://github.com/" + searchParams.get('repo')

    axios.get(`/api/create-documentation?url=${githubUrl}`).then((res) => {
      console.log(res.data.summaries.individual.fileNodes)
      setData(res.data.summaries.individual.fileNodes)
    })
  }, [])

  useEffect(() => {
    if (!data || !path) return

    // Traverse the data object (no matter the depth) to find the markdown content according to the path
    const current = findContentByPath(data, path)
    setPageMarkdown(current)


  }, [path])

  function findContentByPath(data: any, targetPath: any) {
    function traverse(nodes: any) {
      for (const node of nodes) {
        if (node.path === targetPath) {
          return node.content;
        }
        if (node.type === "tree" && node.content) {
          const result = traverse(node.content);
          if (result !== null) {
            return result;
          }
        }
      }
      return null;
    }

    return traverse(data);
  }

  if (!data) return <div>Loading...</div>

  return (
    <SidebarProvider>
      <AppSidebar data={data} />
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