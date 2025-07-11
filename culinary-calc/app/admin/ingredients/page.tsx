"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Eye, Edit, Trash2, AlertTriangle, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

interface Ingredient {
  id: string
  name: string
  description?: string
  unit: string
  unitCost: number
  stock: number
  minStock: number
  isActive: boolean
  user: {
    name: string
    email: string
  }
  category?: {
    name: string
  }
  supplier?: {
    name: string
  }
  createdAt: string
}

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalIngredients, setTotalIngredients] = useState(0)

  useEffect(() => {
    fetchIngredients()
  }, [currentPage, searchTerm])

  const fetchIngredients = async () => {
    try {
      // Dados simulados por enquanto
      setIngredients([
        {
          id: "1",
          name: "Farinha de Trigo",
          description: "Farinha especial para panificação",
          unit: "kg",
          unitCost: 4.5,
          stock: 25.5,
          minStock: 10,
          isActive: true,
          user: { name: "João Silva", email: "joao@teste.com" },
          category: { name: "Farinhas" },
          supplier: { name: "Distribuidora Pão & Cia" },
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "Açúcar Cristal",
          description: "Açúcar refinado especial",
          unit: "kg",
          unitCost: 3.2,
          stock: 5.2,
          minStock: 8,
          isActive: true,
          user: { name: "Maria Santos", email: "maria@teste.com" },
          category: { name: "Açúcares" },
          supplier: { name: "Açúcar & Mel Ltda" },
          createdAt: "2024-01-20T14:30:00Z",
        },
      ])
      setTotalIngredients(2)
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return { status: "low", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    } else if (stock <= minStock * 1.5) {
      return { status: "medium", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    } else {
      return { status: "good", color: "bg-green-100 text-green-800", icon: TrendingUp }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Todos os Insumos</h1>
            <p className="text-slate-600">Visualize e gerencie todos os ingredientes do sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Total: {totalIngredients} insumos
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar insumos por nome ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
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
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhum insumo encontrado" : "Nenhum insumo cadastrado"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? "Tente buscar com outros termos" : "Ainda não há insumos no sistema"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredIngredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient.stock, ingredient.minStock)
              const StockIcon = stockStatus.icon

              return (
                <Card key={ingredient.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-indigo-500" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
                            {ingredient.category && <Badge variant="secondary">{ingredient.category.name}</Badge>}
                          </div>

                          <p className="text-sm text-gray-500 mb-2">{ingredient.description}</p>

                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div className="p-2 bg-gray-50 rounded">
                              <div className="text-xs text-gray-500">Criado por:</div>
                              <div className="font-medium text-sm">{ingredient.user.name}</div>
                              <div className="text-xs text-gray-500">{ingredient.user.email}</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                              <div className="text-xs text-gray-500">Fornecedor:</div>
                              <div className="font-medium text-sm">{ingredient.supplier?.name || "N/A"}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                              Custo:{" "}
                              <span className="font-medium">
                                R$ {ingredient.unitCost.toFixed(2)}/{ingredient.unit}
                              </span>
                            </span>
                            <span className="text-gray-600">
                              Valor Total:{" "}
                              <span className="font-medium">
                                R$ {(ingredient.stock * ingredient.unitCost).toFixed(2)}
                              </span>
                            </span>
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
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination */}
        {totalIngredients > 20 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {currentPage} de {Math.ceil(totalIngredients / 20)}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalIngredients / 20)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
