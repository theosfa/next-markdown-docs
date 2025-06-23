// "use client";

// import Link from "next/link";
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar";
// import { Home } from "lucide-react";
// import { FileText } from "lucide-react";

// type SidebarNode = {
//   type: "folder" | "file";
//   name: string;
//   url?: string;
//   title?: string;
//   children?: SidebarNode[];
// };
// export function RecursiveSidebar({ nodes }: { nodes: SidebarNode[] }) {
//   return (
//     <>
//       {nodes.map((node) => {
//         if (node.type === "folder") {
//           return (
//             <SidebarGroup key={node.name}>
//               <SidebarGroupLabel>{node.name}</SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <SidebarMenu className="list-none p-0 m-0">
//                   <RecursiveSidebar nodes={node.children ?? []} />
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           );
//         }

//         return (
//           <SidebarMenuItem key={node.url} className="list-none">
//             <SidebarMenuButton asChild>
//               <Link href={node.url!} className="flex items-center space-x-2">
//                 <FileText className="w-4 h-4" />
//                 <span>{node.title || node.name}</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         );
//       })}
//     </>
//   );
// }
"use client";

import Link from "next/link";
import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronRight, Folder, FileText } from "lucide-react";

type SidebarNode = {
  type: "folder" | "file";
  name: string;
  url?: string;
  title?: string;
  children?: SidebarNode[];
};

export function RecursiveSidebar({ nodes }: { nodes: SidebarNode[] }) {
  return (
    <>
      {nodes.map((node) => {
        if (node.type === "folder") {
          // Folder with collapsible content
          return (
            <SidebarMenuItem key={node.name}>
              <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={false} // or true if you want some folders open by default
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <ChevronRight className="transition-transform w-4 h-4" />
                    <Folder className="w-4 h-4" />
                    <span>{node.name}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <RecursiveSidebar nodes={node.children ?? []} />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          );
        }

        // File item
        return (
          <SidebarMenuItem key={node.url ?? node.name}>
            <SidebarMenuButton asChild>
              <Link href={node.url!} className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>{node.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
