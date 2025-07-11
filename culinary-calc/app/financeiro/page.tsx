"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Download } from "lucide-react"
import { useState, useEffect } from "react"

interface FinancialData {
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  profitMargin: number
  monthlyGrowth: number
}

export default function FinanceiroPage() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    totalCosts: 0,
    totalProfit: 0,
    profitMargin: 0,
    monthlyGrowth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      // Dados simulados por enquanto
      setFinancialData({
        totalRevenue: 15750.0,
        totalCosts: 9450.0,
        totalProfit: 6300.0,
        profitMargin: 40,
        monthlyGrowth: 12.5,
      })
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
            <p className="text-indigo-100">Acompanhe a performance financeira do seu negócio</p>
          </div>
          <Button className="bg-white text-indigo-500 hover:bg-indigo-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : `R$ ${financialData.totalRevenue.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">+{financialData.monthlyGrowth}% este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custos Totais</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? "..." : `R$ ${financialData.totalCosts.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">-2.5% este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : `R$ ${financialData.totalProfit.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">+18.2% este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
              <PieChart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? "..." : `${financialData.profitMargin}%`}
              </div>
              <p className="text-xs text-muted-foreground">+3.2% este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Receitas vs Custos
              </CardTitle>
              <CardDescription>Comparação mensal de receitas e custos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico de barras será implementado aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Distribuição de Custos
              </CardTitle>
              <CardDescription>Breakdown dos custos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico de pizza será implementado aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Recipes */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Receitas Mais Lucrativas</CardTitle>
            <CardDescription>Top 5 receitas com melhor performance financeira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Bolo de Chocolate Premium", revenue: 2450.0, margin: 55, growth: 15 },
                { name: "Pão Artesanal Integral", revenue: 1890.0, margin: 42, growth: 8 },
                { name: "Croissant Francês", revenue: 1650.0, margin: 38, growth: 22 },
                { name: "Torta de Frutas Vermelhas", revenue: 1420.0, margin: 48, growth: -3 },
                { name: "Pão de Açúcar Tradicional", revenue: 1280.0, margin: 35, growth: 12 },
              ].map((recipe, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{recipe.name}</h4>
                      <p className="text-sm text-gray-500">Margem: {recipe.margin}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R$ {recipe.revenue.toFixed(2)}</p>
                    <p className={`text-sm ${recipe.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {recipe.growth >= 0 ? "+" : ""}
                      {recipe.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Análise de Margem</CardTitle>
              <CardDescription>Analise a rentabilidade das suas receitas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ver Análise Completa</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Projeção de Custos</CardTitle>
              <CardDescription>Simule cenários futuros de custos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                Fazer Simulação
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Relatórios</CardTitle>
              <CardDescription>Gere relatórios detalhados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
