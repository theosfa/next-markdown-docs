// components/app-sidebar.tsx
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarMenu } from "@/components/ui/sidebar";
import { RecursiveSidebar } from "./recursive-sidebar";
import { getSidebarTree, SidebarNode } from "@/lib/posts";

export default async function AppSidebar({
  sidebarTree,
}: {
  sidebarTree: SidebarNode[];
}) {
  const tree = sidebarTree; // already fetched in layout

  return (
    <Sidebar className="w-64 border-r overflow-auto">
      <SidebarContent>
        <div className="px-4 py-2 font-semibold text-lg tracking-tight">
          <Link
            href="/"
            className="flex flex-row justify-between items-center"
          >
            My Blog <span className="ml-1">🏠</span>
          </Link>
          <br />
          <Link href="/admin">Admin page</Link>
        </div>

        <SidebarMenu className="list-none p-0 m-0">
          <RecursiveSidebar nodes={tree} />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
