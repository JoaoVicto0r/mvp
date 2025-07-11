import { NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function GET() {
  try {
    const stats = await AdminService.getSystemStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
