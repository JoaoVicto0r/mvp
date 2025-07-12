"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Search, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Ingredient {
  id: string
  name: string
  description?: string
  unit: string
  unitCost: number
  stock: number
  minStock: number
  isActive: boolean
  category?: {
    name: string
    color: string
  }
  supplier?: {
    name: string
  }
}

export default function InsumosPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      const res = await fetch("/insumos")
      if (!res.ok) throw new Error("Erro ao buscar insumos")
      const data = await res.json()
      setIngredients(data)
    } catch (error) {
      console.error("Erro ao carregar insumos:", error)
      setIngredients([])
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return { status: "low", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    } else if (stock <= minStock * 1.5) {
      return { status: "medium", color: "bg-yellow-100 text-yellow-800", icon: TrendingDown }
    } else {
      return { status: "good", color: "bg-green-100 text-green-800", icon: TrendingUp }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Insumos</h1>
            <p className="text-indigo-100">Gerencie seu estoque de ingredientes</p>
          </div>
          <Button
            className="bg-white text-indigo-500 hover:bg-indigo-50"
            onClick={() => router.push("/insumos/novo")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Insumo
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar insumos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Insumos</CardTitle>
              <Package className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{ingredients.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {ingredients.filter((i) => i.stock <= i.minStock).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {ingredients.reduce((total, item) => total + item.stock * item.unitCost, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-white/90 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
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
          ) : filteredIngredients.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhum insumo encontrado" : "Nenhum insumo cadastrado"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "Tente buscar com outros termos" : "Comece adicionando seus primeiros insumos"}
                </p>
                {!searchTerm && (
                  <Button
                    className="bg-indigo-500 text-white hover:bg-indigo-600"
                    onClick={() => router.push("/insumos/novo")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Insumo
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredIngredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient.stock, ingredient.minStock)
              const StockIcon = stockStatus.icon

              return (
                <Card key={ingredient.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: ingredient.category?.color + "20" }}
                        >
                          <Package className="w-6 h-6" style={{ color: ingredient.category?.color }} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
                            {ingredient.category && (
                              <Badge
                                variant="secondary"
                                style={{
                                  backgroundColor: ingredient.category.color + "20",
                                  color: ingredient.category.color,
                                }}
                              >
                                {ingredient.category.name}
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 mb-2">{ingredient.description}</p>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                              Custo:{" "}
                              <span className="font-medium">
                                R$ {ingredient.unitCost.toFixed(2)}/{ingredient.unit}
                              </span>
                            </span>
                            {ingredient.supplier && (
                              <span className="text-gray-600">
                                Fornecedor: <span className="font-medium">{ingredient.supplier.name}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={stockStatus.color}>
                              <StockIcon className="w-3 h-3 mr-1" />
                              {ingredient.stock} {ingredient.unit}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Mín: {ingredient.minStock} {ingredient.unit}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/insumos/${ingredient.id}/editar`)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => router.push(`/insumos/${ingredient.id}`)}
                          >
                            Ajustar Estoque
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}