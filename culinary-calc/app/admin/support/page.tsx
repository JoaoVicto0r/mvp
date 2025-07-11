"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Clock, CheckCircle, AlertTriangle, User, Calendar, Reply } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  admin_response?: string
  created_at: string
  updated_at: string
  user?: {
    name: string
    email: string
  }
  admin?: {
    name: string
  }
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [response, setResponse] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchTickets()
  }, [statusFilter])

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/admin/support?status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets)
      }
    } catch (error) {
      console.error("Erro ao carregar tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const respondToTicket = async (ticketId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, status }),
      })

      if (res.ok) {
        setResponse("")
        setSelectedTicket(null)
        fetchTickets()
      }
    } catch (error) {
      console.error("Erro ao responder ticket:", error)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgente</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Aberto</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolvido</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Fechado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4" />
      case "in_progress":
        return <AlertTriangle className="w-4 h-4" />
      case "resolved":
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tickets de Suporte</h1>
            <p className="text-slate-600">Gerencie e responda aos chamados de suporte</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-2">
              {[
                { value: "all", label: "Todos" },
                { value: "open", label: "Abertos" },
                { value: "in_progress", label: "Em Andamento" },
                { value: "resolved", label: "Resolvidos" },
                { value: "closed", label: "Fechados" },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
                <p className="text-gray-500">
                  {statusFilter === "all"
                    ? "Não há tickets de suporte no momento"
                    : `Não há tickets com status "${statusFilter}"`}
                </p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(ticket.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.message}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>
                              {ticket.user?.name} ({ticket.user?.email})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(ticket.created_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>

                        {ticket.admin_response && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Resposta:</strong> {ticket.admin_response}
                            </p>
                            {ticket.admin && <p className="text-xs text-blue-600 mt-1">Por: {ticket.admin.name}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                            disabled={ticket.status === "closed"}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Responder
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Responder Ticket</DialogTitle>
                            <DialogDescription>
                              Ticket de {ticket.user?.name} - {ticket.subject}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">Mensagem Original:</h4>
                              <p className="text-sm text-gray-700">{ticket.message}</p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Sua Resposta:</label>
                              <Textarea
                                placeholder="Digite sua resposta..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={4}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => respondToTicket(ticket.id, "in_progress")}
                                disabled={!response.trim()}
                              >
                                Responder e Marcar em Andamento
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => respondToTicket(ticket.id, "resolved")}
                                disabled={!response.trim()}
                              >
                                Responder e Resolver
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
