"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Search, Eye, Edit, Trash2, Users, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface Recipe {
  id: string
  name: string
  description?: string
  servings: number
  preparationTime?: number
  difficulty?: string
  finalCost: number
  sellingPrice: number
  profitMargin: number
  isActive: boolean
  user: {
    name: string
    email: string
  }
  category?: {
    name: string
  }
  createdAt: string
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecipes, setTotalRecipes] = useState(0)

  useEffect(() => {
    fetchRecipes()
  }, [currentPage, searchTerm])

  const fetchRecipes = async () => {
    try {
      // Dados simulados por enquanto
      setRecipes([
        {
          id: "1",
          name: "Pão Francês",
          description: "Pão tradicional brasileiro",
          servings: 20,
          preparationTime: 180,
          difficulty: "Médio",
          finalCost: 15.5,
          sellingPrice: 25.0,
          profitMargin: 38,
          isActive: true,
          user: { name: "João Silva", email: "joao@teste.com" },
          category: { name: "Pães" },
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "Bolo de Chocolate",
          description: "Bolo fofinho de chocolate",
          servings: 12,
          preparationTime: 90,
          difficulty: "Fácil",
          finalCost: 22.3,
          sellingPrice: 45.0,
          profitMargin: 50,
          isActive: true,
          user: { name: "Maria Santos", email: "maria@teste.com" },
          category: { name: "Bolos" },
          createdAt: "2024-01-20T14:30:00Z",
        },
      ])
      setTotalRecipes(2)
    } catch (error) {
      console.error("Erro ao carregar receitas:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "fácil":
        return "bg-green-100 text-green-800"
      case "médio":
        return "bg-yellow-100 text-yellow-800"
      case "difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Todas as Receitas</h1>
            <p className="text-slate-600">Visualize e gerencie todas as receitas do sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Total: {totalRecipes} receitas
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar receitas por nome ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredRecipes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Nenhuma receita encontrada" : "Nenhuma receita cadastrada"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Tente buscar com outros termos" : "Ainda não há receitas no sistema"}
              </p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <CardDescription>{recipe.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} porções</span>
                      </div>
                      {recipe.preparationTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.preparationTime}min</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Criado por:</div>
                      <div className="font-medium">{recipe.user.name}</div>
                      <div className="text-sm text-gray-500">{recipe.user.email}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Custo Final</p>
                        <p className="font-semibold text-green-600">R$ {recipe.finalCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Preço Venda</p>
                        <p className="font-semibold text-blue-600">R$ {recipe.sellingPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Margem de Lucro</span>
                        <span className="text-xs font-semibold text-indigo-600">{recipe.profitMargin}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${Math.min(recipe.profitMargin, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalRecipes > 20 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {currentPage} de {Math.ceil(totalRecipes / 20)}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalRecipes / 20)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
