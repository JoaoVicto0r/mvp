import { type NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search") || ""

    const result = await AdminService.getAllUsers(page, 20, search)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
