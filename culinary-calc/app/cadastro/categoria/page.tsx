"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: number
  name: string
  description?: string
  color: string
  _count?: {
    recipes: number
    ingredients: number
  }
}

export default function CategoriaPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366f1",
  })
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Erro ao buscar categorias")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormData({ name: "", description: "", color: "#6366f1" })
        setShowForm(false)
        fetchCategories()
      } else {
        alert("Erro ao criar categoria")
      }
    } catch (error) {
      alert("Erro ao criar categoria")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/cadastro/categoria/${id}/editar`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCategories()
      } else {
        alert("Erro ao excluir categoria")
      }
    } catch (error) {
      alert("Erro ao excluir categoria")
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const colorOptions = [
    "#f59e0b",
    "#ef4444",
    "#10b981",
    "#3b82f6",
    "#f97316",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#ec4899",
    "#6366f1",
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Categorias</h1>
            <p className="text-indigo-100">Organize seus insumos e receitas por categorias</p>
          </div>
          <Button className="bg-white text-indigo-500 hover:bg-indigo-50" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        {showForm && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Nova Categoria</CardTitle>
              <CardDescription>Crie uma nova categoria para organizar seus itens</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Categoria *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Temperos"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? "border-gray-800" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData({ ...formData, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva esta categoria..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    Salvar Categoria
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-white/90 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm ? "Nenhuma categoria encontrada" : "Nenhuma categoria cadastrada"}
              </h3>
              <p className="text-indigo-100 mb-4">
                {searchTerm ? "Tente buscar com outros termos" : "Comece criando sua primeira categoria"}
              </p>
              {!searchTerm && (
                <Button className="bg-white text-indigo-500 hover:bg-indigo-50" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Categoria
                </Button>
              )}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + "20" }}
                      >
                        <Tag className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(category.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {category._count?.recipes || 0} receitas
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {category._count?.ingredients || 0} insumos
                      </Badge>
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