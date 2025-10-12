"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  Brain,
  Settings,
  Menu,
} from "lucide-react";

type SessionLike = {
  user?: {
    email?: string | null;
    name?: string | null;
  };
} | null;

export default function Sidebar({ session }: { session: SessionLike }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-white border-r transition-all duration-200 ease-in-out
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-4">
        <div className="flex items-center gap-2 flex-1">
          {/* 🔐 clickable */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-2xl text-purple-600 hover:scale-110 transition-transform"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            🔐
          </button>
          {!collapsed && (
            <span className="text-xl font-bold text-purple-600">CryptoGuard</span>
          )}
        </div>

        {/* Collapse button only when expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Collapse sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {!collapsed && (
          <p className="text-sm text-gray-500 px-2 mt-2 mb-2">Navigation</p>
        )}

        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100"
            >
              <LayoutDashboard className="h-5 w-5" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/upload"
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100"
            >
              <Upload className="h-5 w-5" />
              {!collapsed && <span>Upload</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/analyze"
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100"
            >
              <Brain className="h-5 w-5" />
              {!collapsed && <span>Text Analyze</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t">
        {!collapsed ? (
          <div className="text-sm text-gray-600">
            {session?.user?.email ?? "No email"}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
