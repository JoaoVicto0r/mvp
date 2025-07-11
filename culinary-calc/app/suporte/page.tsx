"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Phone, Mail, FileText, HelpCircle, Send } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SuportePage() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (response.ok) {
        alert("Solicitação enviada com sucesso!")
        setFormData({ subject: "", message: "", priority: "medium" })
      } else {
        const error = await response.json()
        alert(error.message || "Erro ao enviar solicitação")
      }
    } catch (error) {
      console.error("Erro ao enviar ticket:", error)
      alert("Erro ao enviar solicitação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Suporte</h1>
          <p className="text-indigo-100">Precisa de ajuda? Estamos aqui para você!</p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <MessageSquare className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <CardTitle>Chat Online</CardTitle>
              <CardDescription>Converse conosco em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/suporte/chat")}>
                Iniciar Chat
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">Disponível das 8h às 18h</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <CardTitle>Telefone</CardTitle>
              <CardDescription>Ligue para nosso suporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="font-semibold text-lg">(11) 4000-0000</p>
                <p className="text-xs text-gray-500 mt-2">Segunda a Sexta, 8h às 18h</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <CardTitle>Email</CardTitle>
              <CardDescription>Envie sua dúvida por email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="font-semibold">suporte@culinarycalc.com</p>
                <p className="text-xs text-gray-500 mt-2">Resposta em até 24h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Enviar Solicitação</CardTitle>
              <CardDescription>Descreva sua dúvida ou problema e entraremos em contato</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    placeholder="Descreva brevemente o problema"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <select
                    id="priority"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva detalhadamente sua dúvida ou problema..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">Como calcular o custo de uma receita?</h4>
                  <p className="text-sm text-gray-600">
                    Acesse a seção "Receitas", clique em "Nova Receita" e adicione os ingredientes. O sistema calculará
                    automaticamente os custos baseado nos preços dos insumos.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">Como gerenciar o estoque de insumos?</h4>
                  <p className="text-sm text-gray-600">
                    Na seção "Insumos", você pode adicionar novos ingredientes, definir estoque mínimo e receber alertas
                    quando o estoque estiver baixo.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">Como exportar relatórios financeiros?</h4>
                  <p className="text-sm text-gray-600">
                    Vá para a seção "Financeiro" e clique em "Exportar Relatório". Você pode escolher o período e
                    formato do relatório.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Como alterar minha senha?</h4>
                  <p className="text-sm text-gray-600">
                    Clique no seu nome no canto superior direito, vá em "Configurações" e selecione "Alterar Senha".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentação e Tutoriais
            </CardTitle>
            <CardDescription>Guias completos para usar todas as funcionalidades do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => router.push("/docs/guia-inicio")}
              >
                <h4 className="font-medium mb-1">Guia de Início Rápido</h4>
                <p className="text-xs text-gray-500">Primeiros passos no sistema</p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => router.push("/docs/gestao-receitas")}
              >
                <h4 className="font-medium mb-1">Gestão de Receitas</h4>
                <p className="text-xs text-gray-500">Como criar e gerenciar receitas</p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => router.push("/docs/controle-estoque")}
              >
                <h4 className="font-medium mb-1">Controle de Estoque</h4>
                <p className="text-xs text-gray-500">Gerenciamento de insumos</p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => router.push("/docs/analise-financeira")}
              >
                <h4 className="font-medium mb-1">Análise Financeira</h4>
                <p className="text-xs text-gray-500">Relatórios e indicadores</p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => router.push("/docs/calculadora-custos")}
              >
                <h4 className="font-medium mb-1">Calculadora de Custos</h4>
                <p className="text-xs text-gray-500">Como usar a calculadora</p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => router.push("/docs/configuracoes-avancadas")}
              >
                <h4 className="font-medium mb-1">Configurações Avançadas</h4>
                <p className="text-xs text-gray-500">Personalização do sistema</p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}