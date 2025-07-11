import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

// Tipos do banco de dados
export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  color: string
  user_id?: string
  created_at: string
  updated_at: string
  _count?: {
    recipes: number
    ingredients: number
  }
}

export interface Supplier {
  id: string
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  is_active: boolean
  user_id?: string
  created_at: string
  updated_at: string
}

export interface Ingredient {
  id: string
  name: string
  description?: string
  unit: string
  unit_cost: number
  stock: number
  min_stock: number
  expiration_date?: string
  is_active: boolean
  category_id?: number
  supplier_id?: string
  user_id?: string
  category?: Category
  supplier?: Supplier
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  name: string
  description?: string
  servings: number
  preparation_time?: number
  difficulty?: string
  instructions?: string
  total_cost: number
  operational_cost: number
  final_cost: number
  selling_price: number
  profit_margin: number
  net_profit: number
  is_active: boolean
  category_id?: number
  user_id?: string
  category?: Category
  recipe_ingredients?: RecipeIngredient[]
  created_at: string
  updated_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  cost: number
  ingredient?: Ingredient
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}
