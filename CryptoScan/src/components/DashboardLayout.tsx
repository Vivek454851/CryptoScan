"use client";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

type SessionLike = {
  user?: {
    email?: string | null;
    name?: string | null;
  };
} | null;

export default function DashboardLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionLike;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar session={session} />

      {/* Main Content */}
      <main className="flex-1 min-h-screen w-full p-6 md:p-10 bg-gray-50">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back,{" "}
            <span className="text-purple-600">
              {session?.user?.name ?? "User"}
            </span>{" "}
            👋
          </h1>

          <Button asChild variant="destructive">
            <Link href="/" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </Button>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
