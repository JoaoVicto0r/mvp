import { type NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const status = searchParams.get("status") || "all"

    const result = await AdminService.getAllSupportTickets(page, 20, status)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Admin support tickets error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
