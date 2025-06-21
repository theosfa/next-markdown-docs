import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { getSidebarTree } from "@/lib/posts";
import { RecursiveSidebar } from "./recursive-sidebar";
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
        <Link href={"/"}>My Blog</Link><br />
        <Link href={"/admin"}>Admin page</Link></div>
      <SidebarMenu className="list-none p-0 m-0">  {/* add this */}
        <RecursiveSidebar nodes={sidebarTree} />
      </SidebarMenu>
    </SidebarContent>

    </Sidebar>
  );
}
