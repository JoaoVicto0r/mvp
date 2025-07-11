"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, Search, User, Calendar, Filter } from "lucide-react"
import { useState, useEffect } from "react"

interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType?: string
  entityId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)

  useEffect(() => {
    fetchLogs()
  }, [currentPage, searchTerm])

  const fetchLogs = async () => {
    try {
      // Dados simulados por enquanto
      setLogs([
        {
          id: "1",
          userId: "user-1",
          action: "user_login",
          entityType: "user",
          entityId: "user-1",
          details: { loginMethod: "email" },
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0...",
          createdAt: "2024-01-22T10:30:00Z",
          user: { name: "João Silva", email: "joao@teste.com" },
        },
        {
          id: "2",
          userId: "user-2",
          action: "recipe_created",
          entityType: "recipe",
          entityId: "recipe-1",
          details: { recipeName: "Pão Francês", servings: 20 },
          ipAddress: "192.168.1.2",
          userAgent: "Mozilla/5.0...",
          createdAt: "2024-01-22T11:15:00Z",
          user: { name: "Maria Santos", email: "maria@teste.com" },
        },
        {
          id: "3",
          userId: "user-1",
          action: "support_ticket_created",
          entityType: "support_ticket",
          entityId: "ticket-1",
          details: { subject: "Dúvida sobre custos", priority: "medium" },
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0...",
          createdAt: "2024-01-22T14:20:00Z",
          user: { name: "João Silva", email: "joao@teste.com" },
        },
      ])
      setTotalLogs(3)
    } catch (error) {
      console.error("Erro ao carregar logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getActionBadge = (action: string) => {
    if (action.includes("login")) {
      return <Badge className="bg-blue-100 text-blue-800">Login</Badge>
    } else if (action.includes("created")) {
      return <Badge className="bg-green-100 text-green-800">Criação</Badge>
    } else if (action.includes("updated")) {
      return <Badge className="bg-yellow-100 text-yellow-800">Atualização</Badge>
    } else if (action.includes("deleted")) {
      return <Badge className="bg-red-100 text-red-800">Exclusão</Badge>
    } else if (action.includes("support")) {
      return <Badge className="bg-purple-100 text-purple-800">Suporte</Badge>
    } else {
      return <Badge variant="secondary">{action}</Badge>
    }
  }

  const formatAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      user_login: "Login do usuário",
      user_logout: "Logout do usuário",
      recipe_created: "Receita criada",
      recipe_updated: "Receita atualizada",
      recipe_deleted: "Receita excluída",
      ingredient_created: "Insumo criado",
      ingredient_updated: "Insumo atualizado",
      ingredient_deleted: "Insumo excluído",
      support_ticket_created: "Ticket de suporte criado",
      support_ticket_status_changed: "Status do ticket alterado",
      supplier_created: "Fornecedor criado",
      supplier_updated: "Fornecedor atualizado",
    }
    return actionMap[action] || action
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Log de Atividades</h1>
            <p className="text-slate-600">Monitore todas as ações realizadas no sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Total: {totalLogs} atividades
            </Badge>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ação, usuário ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhuma atividade encontrada" : "Nenhuma atividade registrada"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Tente buscar com outros termos"
                    : "As atividades aparecerão aqui conforme os usuários interagem com o sistema"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log, index) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-slate-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{formatAction(log.action)}</h3>
                        {getActionBadge(log.action)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>
                            {log.user.name} ({log.user.email})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(log.createdAt).toLocaleString("pt-BR")}</span>
                        </div>
                      </div>

                      {log.details && (
                        <div className="p-3 bg-gray-50 rounded-lg mb-3">
                          <div className="text-xs text-gray-500 mb-1">Detalhes:</div>
                          <div className="text-sm">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="font-medium">{key}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 text-xs text-gray-500">
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        {log.entityType && log.entityId && (
                          <span>
                            Entidade: {log.entityType}#{log.entityId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">#{index + 1}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalLogs > 50 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {currentPage} de {Math.ceil(totalLogs / 50)}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalLogs / 50)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
