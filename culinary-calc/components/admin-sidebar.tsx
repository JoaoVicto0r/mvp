"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Users,
  ChefHat,
  Package,
  Building,
  MessageSquare,
  Activity,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      matchPattern: "/admin",
      exact: true,
    },
    {
      href: "/admin/users",
      label: "Usuários",
      icon: <Users className="w-5 h-5" />,
      matchPattern: "/admin/users",
    },
    {
      href: "/admin/recipes",
      label: "Receitas",
      icon: <ChefHat className="w-5 h-5" />,
      matchPattern: "/admin/recipes",
    },
    {
      href: "/admin/ingredients",
      label: "Insumos",
      icon: <Package className="w-5 h-5" />,
      matchPattern: "/admin/ingredients",
    },
    {
      href: "/admin/suppliers",
      label: "Fornecedores",
      icon: <Building className="w-5 h-5" />,
      matchPattern: "/admin/suppliers",
    },
    {
      href: "/admin/support",
      label: "Suporte",
      icon: <MessageSquare className="w-5 h-5" />,
      matchPattern: "/admin/support",
    },
    {
      href: "/admin/activity",
      label: "Atividades",
      icon: <Activity className="w-5 h-5" />,
      matchPattern: "/admin/activity",
    },
  ]

  const isActive = (path: string, matchPattern?: string, exact = false) => {
    if (exact) {
      return pathname === path
    }
    return matchPattern ? pathname.startsWith(matchPattern) : pathname === path
  }

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      logout()
    }
  }

  return (
    <aside
      aria-label="Navegação administrativa"
      className="w-80 h-screen bg-slate-900 p-8 fixed left-0 top-0 z-50 shadow-xl"
    >
      {/* Cabeçalho */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wider">Admin Panel</h1>
            <p className="text-slate-400 text-xs tracking-wider">CulinaryCalc</p>
          </div>
        </div>

        {user && (
          <div className="p-3 bg-slate-800 rounded-lg">
            <p className="text-xs font-extrabold text-red-400 tracking-wider">ADMINISTRADOR</p>
            <p className="text-xs text-slate-300 tracking-wider">{user.name}</p>
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav className="space-y-2">
        {/* Link para voltar ao dashboard normal */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 w-full text-left p-4 rounded-lg tracking-wider transition-all text-slate-300 hover:bg-slate-800 border border-slate-700 mb-4"
        >
          <Home className="w-5 h-5" />
          <span>Voltar ao Dashboard</span>
        </Link>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 w-full text-left p-4 rounded-lg tracking-wider transition-all ${
              isActive(item.href, item.matchPattern, item.exact)
                ? "bg-red-500 text-white font-extrabold"
                : "text-slate-300 hover:bg-slate-800"
            }`}
            aria-current={isActive(item.href, item.matchPattern, item.exact) ? "page" : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left p-4 rounded-lg tracking-wider transition-all text-red-400 hover:bg-red-900/20 mt-8"
          aria-label="Sair do sistema"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </nav>

      {/* Elemento decorativo */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="w-32 h-32 bg-red-500 rounded-tr-[40px] rounded-br-[40px] relative" aria-hidden="true">
          <div className="absolute inset-0 flex items-center justify-center text-red-300 text-6xl font-extrabold tracking-[8px]">
            A
          </div>
        </div>
      </div>
    </aside>
  )
}
