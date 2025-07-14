import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      name: "Receita Exemplo",
      servings: 10,
      finalCost: 100,
      sellingPrice: 150,
      profitMargin: 50,
      isActive: true,
    },
    // ...outras receitas
  ])
}