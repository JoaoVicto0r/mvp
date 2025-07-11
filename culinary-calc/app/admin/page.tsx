"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ChefHat, Package, MessageSquare, Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalRecipes: number
  totalIngredients: number
  totalSuppliers: number
  openTickets: number
  resolvedTickets: number
  recentActivity: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRecipes: 0,
    totalIngredients: 0,
    totalSuppliers: 0,
    openTickets: 0,
    resolvedTickets: 0,
    recentActivity: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel Administrativo</h1>
          <p className="text-slate-600">Visão geral do sistema CulinaryCalc</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{stats.activeUsers} ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Cadastradas</CardTitle>
              <ChefHat className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{loading ? "..." : stats.totalRecipes}</div>
              <p className="text-xs text-muted-foreground">Em todo o sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insumos Cadastrados</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{loading ? "..." : stats.totalIngredients}</div>
              <p className="text-xs text-muted-foreground">Todos os usuários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{loading ? "..." : stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">Últimas 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Support & Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Tickets de Suporte
              </CardTitle>
              <CardDescription>Status dos chamados de suporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Tickets Abertos</p>
                      <p className="text-sm text-muted-foreground">Aguardando resposta</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{loading ? "..." : stats.openTickets}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Tickets Resolvidos</p>
                      <p className="text-sm text-muted-foreground">Este mês</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{loading ? "..." : stats.resolvedTickets}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Crescimento do Sistema
              </CardTitle>
              <CardDescription>Métricas de crescimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usuários Ativos</span>
                    <span>{((stats.activeUsers / stats.totalUsers) * 100 || 0).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Resolução</span>
                    <span>
                      {((stats.resolvedTickets / (stats.openTickets + stats.resolvedTickets)) * 100 || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.resolvedTickets / (stats.openTickets + stats.resolvedTickets)) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades administrativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <Users className="h-6 w-6 text-blue-500 mb-2" />
                <p className="font-medium">Gerenciar Usuários</p>
                <p className="text-xs text-muted-foreground">Ver todos os usuários</p>
              </button>

              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
                <MessageSquare className="h-6 w-6 text-orange-500 mb-2" />
                <p className="font-medium">Tickets Pendentes</p>
                <p className="text-xs text-muted-foreground">Responder suporte</p>
              </button>

              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                <Activity className="h-6 w-6 text-green-500 mb-2" />
                <p className="font-medium">Log de Atividades</p>
                <p className="text-xs text-muted-foreground">Ver atividades</p>
              </button>

              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <ChefHat className="h-6 w-6 text-purple-500 mb-2" />
                <p className="font-medium">Todas as Receitas</p>
                <p className="text-xs text-muted-foreground">Visualizar receitas</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
