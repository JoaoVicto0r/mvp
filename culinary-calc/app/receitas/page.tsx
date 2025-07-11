"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Plus, Search, Clock, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
}

export default function ReceitasPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      // Troque a URL abaixo pela rota real da sua API
      const res = await fetch("/api/recipes")
      if (!res.ok) throw new Error("Erro ao buscar receitas")
      const data = await res.json()
      setRecipes(data)
    } catch (error) {
      console.error("Erro ao carregar receitas:", error)
      setRecipes([]) // Garante array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Receitas</h1>
            <p className="text-indigo-100">Gerencie suas receitas e calcule custos</p>
          </div>
          <Button
            className="bg-white text-indigo-500 hover:bg-indigo-50"
            onClick={() => router.push("/receitas/nova")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar receitas..."
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
              <Card key={i} className="bg-white/90 backdrop-blur-sm animate-pulse">
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
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm ? "Nenhuma receita encontrada" : "Nenhuma receita cadastrada"}
              </h3>
              <p className="text-indigo-100 mb-4">
                {searchTerm ? "Tente buscar com outros termos" : "Comece criando sua primeira receita"}
              </p>
              {!searchTerm && (
                <Button
                  className="bg-white text-indigo-500 hover:bg-indigo-50"
                  onClick={() => router.push("/receitas/nova")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Receita
                </Button>
              )}
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => router.push(`/receitas/${recipe.id}/editar`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/receitas/${recipe.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}