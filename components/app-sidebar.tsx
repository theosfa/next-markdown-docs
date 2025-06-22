import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { getSidebarTree } from "@/lib/posts";
import { RecursiveSidebar } from "./recursive-sidebar";
import { ChevronRight, Folder, FileText } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import Link from "next/link";

export async function AppSidebar() {
  const sidebarTree = getSidebarTree();

  return (
    <Sidebar>
      <SidebarContent>
      <div className="px-4 py-2 font-semibold text-lg tracking-tight">
        <Link href={"/"} className="flex flex-row justify-between items-center">My Blog<Folder className="w-4 h-4" /></Link><br />
        <Link href={"/admin"}>Admin page</Link>
        </div>
      <SidebarMenu className="list-none p-0 m-0">  {/* add this */}
        <RecursiveSidebar nodes={sidebarTree} />
      </SidebarMenu>
    </SidebarContent>

    </Sidebar>
  );
}
