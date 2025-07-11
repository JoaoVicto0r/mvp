"use client"

import type React from "react"
import AdminSidebar from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 font-telegraf">
      <div className="flex">
        <AdminSidebar />
        {/* Main Content */}
        <div className="ml-80 flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}
