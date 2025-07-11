"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function NovaReceitaPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    servings: 1,
    preparationTime: "",
    difficulty: "",
    instructions: "",
    categoryId: "",
  })

  const [ingredients, setIngredients] = useState([{ ingredientId: "", quantity: 0, unit: "" }])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nova receita:", { ...formData, ingredients })
    // Implementar criação da receita
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientId: "", quantity: 0, unit: "" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    setIngredients(updated)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/receitas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Nova Receita</h1>
            <p className="text-indigo-100">Crie uma nova receita e calcule seus custos</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Dados principais da receita</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Receita *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Pão Francês"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pães</SelectItem>
                      <SelectItem value="2">Bolos</SelectItem>
                      <SelectItem value="3">Doces</SelectItem>
                      <SelectItem value="4">Salgados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva sua receita..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servings">Porções *</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparationTime">Tempo de Preparo (min)</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    placeholder="120"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredientes */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ingredientes</CardTitle>
              <CardDescription>Adicione os ingredientes e suas quantidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Ingrediente</Label>
                    <Select
                      value={ingredient.ingredientId}
                      onValueChange={(value) => updateIngredient(index, "ingredientId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ingrediente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Farinha de Trigo</SelectItem>
                        <SelectItem value="2">Açúcar Cristal</SelectItem>
                        <SelectItem value="3">Leite Integral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32 space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(index, "quantity", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="w-20 space-y-2">
                    <Label>Unidade</Label>
                    <Input
                      placeholder="kg"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Ingrediente
              </Button>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Modo de Preparo</CardTitle>
              <CardDescription>Descreva o passo a passo da receita</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="1. Misture os ingredientes secos...&#10;2. Adicione os líquidos...&#10;3. Asse por 30 minutos..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={8}
              />
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-4">
            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
              Salvar Receita
            </Button>
            <Link href="/receitas">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
