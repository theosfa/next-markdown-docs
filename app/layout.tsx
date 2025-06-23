// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSidebarTree, SidebarNode } from "@/lib/posts";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Markdown Docs",
  description: "Documentation with Markdown files",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ① Fetch on the server
  const sidebarTree: SidebarNode[] = await getSidebarTree();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen`}>
        <SidebarProvider>
          {/* ② Pass the resolved array into AppSidebar */}
          <AppSidebar sidebarTree={sidebarTree} />

          <main className="flex-1 overflow-auto">
            <SidebarTrigger />
            {children}
            <Toaster />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
