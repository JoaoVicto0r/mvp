import { type NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/admin"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isActive } = await request.json()
    await AdminService.toggleUserStatus(params.id, isActive)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Toggle user status error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
