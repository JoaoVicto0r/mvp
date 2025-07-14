import { NextResponse } from "next/server"

// Mock em memória (apenas para testes locais)
let ingredients: any[] = [
  {
    id: "1",
    name: "Farinha",
    description: "Farinha de trigo",
    unit: "kg",
    unitCost: 5.5,
    stock: 20,
    minStock: 5,
    isActive: true,
    category: { name: "Grãos", color: "#f59e0b" },
    supplier: { name: "Fornecedor A" },
  },
  {
    id: "2",
    name: "Açúcar",
    description: "Açúcar refinado",
    unit: "kg",
    unitCost: 4.2,
    stock: 10,
    minStock: 3,
    isActive: true,
    category: { name: "Doces", color: "#ef4444" },
    supplier: { name: "Fornecedor B" },
  },
]

export async function GET() {
  return NextResponse.json(ingredients)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newIngredient = {
    ...data,
    id: String(Date.now()),
    isActive: true,
    category: data.category || { name: "Sem categoria", color: "#6366f1" },
    supplier: data.supplier || { name: "Sem fornecedor" },
  }
  ingredients.push(newIngredient)
  return NextResponse.json(newIngredient, { status: 201 })
}